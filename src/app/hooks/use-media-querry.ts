/** @format */
import { useSyncExternalStore, useCallback } from "react";

export function useMediaQuery(query: string): boolean {
	// 1. Subscribe function: tells React how to listen for changes
	const subscribe = useCallback(
		(callback: () => void) => {
			const matchMedia = window.matchMedia(query);
			matchMedia.addEventListener("change", callback);
			return () => matchMedia.removeEventListener("change", callback);
		},
		[query],
	);

	// 2. Get snapshot: tells React how to read the current value
	const getSnapshot = () => {
		return window.matchMedia(query).matches;
	};

	// 3. Server snapshot: tells Next.js what to assume during SSR (usually false)
	const getServerSnapshot = () => false;

	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
