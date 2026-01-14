/** @format */
import "./tiptap/tiptap.css";
interface EditorContentProps {
	content: string | null;
}

export function EditorContent({ content }: EditorContentProps) {
	return (
		<div className='tiptap-root-wrapper'>
			<div
				/* We use 'ProseMirror' because your CSS targets '.ProseMirror h1', etc.
           We add 'readonly-view' to disable editor-specific behavior.
        */
				className='ProseMirror readonly-view'
				dangerouslySetInnerHTML={{ __html: content || "No content available." }}
			/>
		</div>
	);
}
