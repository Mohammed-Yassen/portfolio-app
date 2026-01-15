/** @format */
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
	// Use the Pooled URL (6543)
	const connectionString = process.env.DATABASE_URL;
	const pool = new Pool({ connectionString });
	const adapter = new PrismaPg(pool);

	// In modern Prisma, the adapter is passed here.
	// We do NOT pass datasourceUrl when using an adapter.
	return new PrismaClient({ adapter });
};

declare global {
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
	globalThis.prismaGlobal = prisma;
}
