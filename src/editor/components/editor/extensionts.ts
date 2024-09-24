import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Text from "@tiptap/extension-text";

export const extensions = [
  Document,
  Paragraph,
  Text,
  Placeholder.configure({
    placeholder: "ここに入力してください",
  }),
  Dropcursor,
];
