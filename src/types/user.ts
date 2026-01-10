/** @format */

// This type represents the User object in your database
export type AuthUser = {
	id: string;
	name?: string | null;
	email?: string | null;
	image?: string | null;
	role: "ADMIN" | "USER"; // Matches your logic
	// Add other custom fields here
};

/** @format */
/** @format */

import { User, Profile, SocialLinks, ProfileTranslation } from "@prisma/client";

/**
 * SafeUser: A version of the User model with sensitive data removed.
 * This should be the standard for all UI-related tasks.
 */
export type SafeUser = Omit<User, "password">;

/**
 * Extended User type for Admin Dashboard.
 * Includes nested relations while maintaining security (no password).
 */
export type UserWithProfile = SafeUser & {
	profile:
		| (Profile & {
				socials: SocialLinks[];
				translations: ProfileTranslation[];
		  })
		| null;
};

/**
 * Lightweight profile type for public-facing components.
 */
export type ProfileWithSocials = Profile & {
	socials: SocialLinks[];
	translations: ProfileTranslation[];
};
