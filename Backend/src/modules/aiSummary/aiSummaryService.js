import { prismaClient } from "../../lib/database.js";
import { schoolsRepository } from "../schools/schoolsRepository.js";
import { AppError } from "../../middleware/errorHandler.js";
import { aiChat, aiEnabled } from "../../lib/ai/client.js";
import { cacheDelPattern } from "../../config/redis.js";

const SCHOOL_DETAIL_CACHE_PREFIX = "schools:detail:";
const SCHOOLS_LIST_CACHE_PREFIX = "schools:list:";

export const aiSummaryService = {
  /**
   * Generate a summary for a school using the real AI provider.
   * Creates a DRAFT row in SchoolDraftSummary - does NOT write to the live aiSummary field.
   */
  async generateSummary(school) {
    if (!aiEnabled) {
      // Fallback to template-based summary if AI is not configured
      return this.templateSummary(school);
    }

    const programsList = school.programs?.length
      ? school.programs.map((p) => p.name).join(", ")
      : "various fields of study";

    const systemPrompt =
      "You are an educational content writer for LewaHub, a school directory in Cameroon. " +
      "Write a concise, informative, and engaging summary (2-4 sentences) about a school. " +
      "Highlight its category, location, programs offered, and any notable characteristics. " +
      "Do not invent facts that are not provided. Respond with plain text only, no markdown.";

    const userPrompt = `School name: ${school.name}
Category: ${school.category}
Location: ${school.city}, ${school.region} region
Description: ${school.description || "N/A"}
Programs: ${programsList}
Verified: ${school.verified ? "Yes" : "No"}
Anonymous views: ${school.anonymousViews || 0}`;

    const summary = await aiChat(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      { temperature: 0.5, maxTokens: 200 }
    );

    if (summary) {
      return summary.trim();
    }

    // AI failed - fall back to template
    return this.templateSummary(school);
  },

  /**
   * Template-based fallback summary (used when AI is not configured or fails)
   */
  templateSummary(school) {
    const programsList = school.programs?.length
      ? school.programs.map((p) => p.name).join(", ")
      : "various fields of study";

    return `${school.name} is a ${school.category.toLowerCase()} located in ${school.city}, ${school.region} region. It offers ${school.programs?.length || 0} program(s) including ${programsList}. ${school.verified ? "This school is verified and recognized." : "Verification status is pending."} With ${school.anonymousViews || 0} views from students, it is ${school.anonymousViews > 50 ? "a popular choice" : "gaining attention"} in the education sector.`;
  },

  /**
   * Regenerate a summary for a school. Creates a DRAFT row (not a live update).
   */
  async regenerateSummary(schoolId) {
    const school = await schoolsRepository.findById(schoolId);
    if (!school) {
      throw new AppError("School not found", 404);
    }

    const newSummary = await this.generateSummary(school);

    // Create a DRAFT row - do NOT write directly to the live aiSummary field
    const draft = await prismaClient.schoolDraftSummary.create({
      data: {
        schoolId,
        content: newSummary,
        status: "DRAFT",
      },
    });

    return {
      draftId: draft.id,
      content: newSummary,
      status: draft.status,
      message: "Summary draft created. It will appear publicly after admin approval.",
    };
  },

  /**
   * Regenerate summaries for all schools. Creates DRAFT rows for each.
   */
  async regenerateAllSummaries() {
    const result = await schoolsRepository.findAll({ page: 1, limit: 1000 });
    const schools = result.data;

    const created = [];
    for (const school of schools) {
      const newSummary = await this.generateSummary(school);
      const draft = await prismaClient.schoolDraftSummary.create({
        data: {
          schoolId: school.id,
          content: newSummary,
          status: "DRAFT",
        },
      });
      created.push(draft.id);
    }

    return { created: created.length, total: schools.length };
  },

  /**
   * List pending draft summaries for admin review
   */
  async listDrafts(status = "DRAFT") {
    return prismaClient.schoolDraftSummary.findMany({
      where: { status },
      include: {
        school: {
          select: { id: true, name: true, category: true, city: true, region: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  /**
   * Approve a draft summary - writes it to the live School.aiSummary field
   */
  async approveDraft(draftId) {
    const draft = await prismaClient.schoolDraftSummary.findUnique({
      where: { id: draftId },
    });
    if (!draft) {
      throw new AppError("Draft not found", 404);
    }
    if (draft.status !== "DRAFT") {
      throw new AppError("Only DRAFT summaries can be approved", 400);
    }

    // Write to the live field
    await schoolsRepository.update(draft.schoolId, { aiSummary: draft.content });

    // Mark the draft as approved
    const updated = await prismaClient.schoolDraftSummary.update({
      where: { id: draftId },
      data: { status: "APPROVED" },
    });

    // Invalidate school caches so the new summary appears publicly
    await cacheDelPattern(`${SCHOOL_DETAIL_CACHE_PREFIX}${draft.schoolId}`);
    await cacheDelPattern(`${SCHOOLS_LIST_CACHE_PREFIX}*`);

    return updated;
  },

  /**
   * Reject a draft summary - does NOT affect the live field
   */
  async rejectDraft(draftId) {
    const draft = await prismaClient.schoolDraftSummary.findUnique({
      where: { id: draftId },
    });
    if (!draft) {
      throw new AppError("Draft not found", 404);
    }
    if (draft.status !== "DRAFT") {
      throw new AppError("Only DRAFT summaries can be rejected", 400);
    }

    return prismaClient.schoolDraftSummary.update({
      where: { id: draftId },
      data: { status: "REJECTED" },
    });
  },
};