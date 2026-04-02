import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../generated";

// 1. Validação de Ambiente
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

// 2. Definição do Tipo Global para o TypeScript
// Isso evita erros de "property 'prisma' does not exist on type Global"
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// 3. Função para criar a instância (Encapsulamento)
const createPrismaClient = () => {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });
};

// 4. Lógica do Singleton
// Em produção, sempre criamos uma nova (o arquivo é lido uma vez).
// Em desenvolvimento, usamos o objeto 'global' para persistir entre Hot Reloads.
const prisma = global.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;