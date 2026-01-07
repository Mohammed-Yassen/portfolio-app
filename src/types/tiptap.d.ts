/** @format */

import { SearchAndReplaceStorage } from "./path-to-your-extension"; // Import the type from your extension file

declare module "@tiptap/core" {
	interface Storage {
		searchAndReplace: SearchAndReplaceStorage;
	}
}
