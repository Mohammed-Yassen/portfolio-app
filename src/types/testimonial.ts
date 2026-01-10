/** @format */

// Match this exactly to what your getPublicTestimonials() returns
export type Testimonial = {
	id: string;
	clientName: string;
	clientTitle: string;
	content: string;
	rating: number | null;
	avatarUrl: string | null;
	linkedinUrl: string | null;
	isFeatured: boolean;
	role?: string | null; // Optional: depending on if you selected it
};

interface TestimonialsSectionProps {
	data: Testimonial[];
	locale: string; // Changed from Locale enum to string for flexibility
}
