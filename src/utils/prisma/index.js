// import
import { PrismaClient } from "@prisma/client";

// export
export const prisma = new PrismaClient({
	log: ["query", "info", "warn", "error"],

	errorFormat: "pretty",
});
