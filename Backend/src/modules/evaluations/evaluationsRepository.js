// Repository layer - evaluations storage
// In Phase 2, will use Prisma

let evaluations = [
  {
    _id: "eval-1",
    studentId: "student-1",
    institutionId: "inst-1",
    score: 8,
    notes: "Excellent university with great facilities.",
    createdAt: "2026-07-20T10:00:00Z",
  },
];

export const evaluationsRepository = {
  async findByInstitution(institutionId) {
    return evaluations.filter((e) => e.institutionId === institutionId);
  },

  async create(data) {
    const newEval = {
      _id: `eval-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    evaluations.push(newEval);
    return newEval;
  },

  async findAll() {
    return evaluations;
  },

  async getAggregate(institutionId) {
    const instEvals = evaluations.filter((e) => e.institutionId === institutionId);
    if (instEvals.length === 0) {
      return { average: 0, count: 0, total: 0 };
    }
    const total = instEvals.reduce((sum, e) => sum + e.score, 0);
    const average = total / instEvals.length;
    return {
      average: Math.round(average * 10) / 10,
      count: instEvals.length,
      total,
    };
  },
};
