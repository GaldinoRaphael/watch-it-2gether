import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated";


export class PrismaService {
  private _prisma: PrismaClient;

  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error("DATABASE_URL is not defined in environment variables");
    }

    this._prisma = this.createPrismaClient(connectionString);
  }

  createPrismaClient = (connectionString: string) => {
    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log:
        process.env.NODE_ENV === "development"
          ? ["query", "error", "warn"]
          : ["error"],
    });
  };

  get client(){
    return this._prisma;
  }


  async disconnect() {
    await this._prisma.$disconnect();
  }
}

export const prismaService = new PrismaService();
