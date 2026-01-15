/** @format */

// /** @format */

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: process.env.DATABASE_URL,
		shadowDatabaseUrl: process.env.DIRECT_URL, // Add this line
	},
});
// /** @format */
// import "dotenv/config";
// import { defineConfig } from "prisma/config";

// export default defineConfig({
// 	schema: "prisma/schema.prisma",
// 	datasource: {
// 		// DATABASE_URL (Port 6543) for general use
// 		url: process.env.DATABASE_URL!,
// 		// directUrl: process.env.DIRECT_URL, // This property is not part of defineConfig's datasource type
// 		//
// 		shadowDatabaseUrl: undefined,
// 	},
// });
