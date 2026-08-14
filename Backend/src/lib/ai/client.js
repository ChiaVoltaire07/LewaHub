// AI provider wrapper - isolates the AI provider so it can be swapped later
// Currently supports OpenAI-compatible APIs via fetch

const AI_PROVIDER = process.env.AI_PROVIDER || "openai";
const AI_API_KEY = process.env.AI_API_KEY;
const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";
const AI_BASE_URL = process.env.AI_BASE_URL || "https://api.openai.com/v1";

export const aiEnabled = Boolean(AI_API_KEY);

/**
 * Send a chat completion request to the AI provider.
 * Returns the text content of the response, or null if AI is not configured.
 */
export async function aiChat(messages, options = {}) {
  if (!aiEnabled) {
    return null;
  }

  const { temperature = 0.3, maxTokens = 500, responseFormat } = options;

  try {
    const body = {
      model: AI_MODEL,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    if (responseFormat) {
      body.response_format = responseFormat;
    }

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AI_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("⚠️ AI request failed:", response.status, errorText.slice(0, 200));
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? null;
  } catch (err) {
    console.warn("⚠️ AI request error:", err.message);
    return null;
  }
}

/**
 * Ask the AI to return structured JSON. Validates the response is parseable JSON.
 * Returns the parsed object, or null on failure.
 */
export async function aiJson(systemPrompt, userPrompt, schema) {
  const content = await aiChat(
    [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    { responseFormat: { type: "json_object" } }
  );

  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    if (schema) {
      const result = schema.safeParse(parsed);
      if (!result.success) {
        console.warn("⚠️ AI response failed schema validation:", result.error.errors);
        return null;
      }
      return result.data;
    }
    return parsed;
  } catch (err) {
    console.warn("⚠️ AI response was not valid JSON:", err.message);
    return null;
  }
}