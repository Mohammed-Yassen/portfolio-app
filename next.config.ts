/** @format */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// Ensure this path leads EXACTLY to your i18n.ts file
const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
	// This allows the DB driver to run in the Node.js environment
	serverExternalPackages: ["@prisma/client", "mongoose", "pg"],

	images: {
		remotePatterns: [
			{ protocol: "https", hostname: "utfs.io", pathname: "/f/**" },
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
				pathname: "/**",
			},
		],
	},
};

export default withNextIntl(nextConfig);
