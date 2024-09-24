import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensionts";
import DragHandle from "../../extensions/drag-handle";

import "./index.css";

const content = `
  <p>111</p>
  <p>222222</p>
  <p>333333333</p>
`;

export default function Editor() {
  const editor = useEditor({
    extensions: extensions,
    content: content,
  });

  if (!editor) return null;

  return (
    <>
      <EditorContent editor={editor} />
      <DragHandle editor={editor} />
    </>
  );
}
