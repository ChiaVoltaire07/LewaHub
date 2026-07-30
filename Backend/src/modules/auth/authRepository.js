// Repository layer - admin storage
// In Phase 2, will use Prisma

let admins = [
  {
    id: "admin-1",
    email: "admin@lewahub.com",
    password: "$2a$10$A8zVgjH6iXgIwcG59GZ7guixfnLsdp2D2HnrYBE/W7u3M1wesZfzi", // bcrypt hash of "admin123"
    name: "LewaHub Admin",
    createdAt: new Date().toISOString(),
  },
];

export const authRepository = {
  async findByEmail(email) {
    return admins.find((a) => a.email === email.toLowerCase());
  },

  async findById(id) {
    return admins.find((a) => a.id === id);
  },

  async create(data) {
    const newAdmin = {
      id: `admin-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
    };
    admins.push(newAdmin);
    return newAdmin;
  },
};
