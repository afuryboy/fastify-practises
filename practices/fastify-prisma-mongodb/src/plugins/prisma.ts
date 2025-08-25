import { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { PrismaClient } from "../generated/prisma";

declare module "fastify" {
  export interface FastifyInstance {
    prisma: PrismaClient;
  }
}

export default fp(async (fastify: FastifyInstance, opts) => {
  try {
    const prismaClient = new PrismaClient();
    await prismaClient.$connect();
    fastify.decorate("prisma", prismaClient);

    fastify.addHook("onClose", async (app: FastifyInstance) => {
      await app.prisma.$disconnect();
    });
  } catch (error) {
    fastify.log.error('Failed to connect to database:', error as any);
    throw new Error('Database connection failed');
  }
});
