/** @format */
import { useEffect, useState } from "react";

export function useIsMounted() {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		// ننتظر حتى يتم رسم الإطار القادم في المتصفح
		const frame = requestAnimationFrame(() => {
			setMounted(true);
		});

		return () => cancelAnimationFrame(frame);
	}, []);

	return mounted;
}
