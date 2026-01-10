/** @format */
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
	serverExternalPackages: ["@prisma/client", "mongoose", "pg"],

	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io", // Your UploadThing images
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com", // Google Profile Pictures
			},
			{
				protocol: "https",
				hostname: "googleusercontent.com", // Fallback for other Google images
			},
		],
	},

	// Correct placement for experimental settings
	experimental: {
		proxyTimeout: 60000,
	},

	typescript: {
		ignoreBuildErrors: false,
	},
};

export default withNextIntl(nextConfig);
