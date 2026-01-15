/** @format */

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
	schema: "prisma/schema.prisma",
	datasource: {
		// This MUST be the Direct URL (5432)
		url: process.env.DIRECT_URL,
	},
});
