import { Editor } from "@tiptap/react";
import { DragEvent, useCallback, useEffect, useState } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import { Slice } from "@tiptap/pm/model";

import styles from "./index.module.css";

class Dragging {
  constructor(
    readonly slice: Slice,
    readonly move: boolean,
    readonly node?: NodeSelection
  ) {}
}

type DragInfo = {
  dom: HTMLElement;
  nodeSelection: NodeSelection;
};

type Props = {
  editor: Editor;
};

export default function DragHandle({ editor }: Props) {
  const [dragInfo, setDragInfo] = useState<DragInfo | null>(null);

  const setTopBlockDragInfo = useCallback(
    (pos: number) => {
      const $pos = editor.state.doc.resolve(pos);

      setDragInfo({
        dom: editor.view.domAtPos($pos.start(1)).node as HTMLElement,
        nodeSelection: NodeSelection.create(editor.state.doc, $pos.before(1)),
      });
    },
    [editor]
  );

  const handleClick = useCallback(() => {
    if (dragInfo == null) return;

    editor.chain().focus().setNodeSelection(dragInfo.nodeSelection.from).run();
  }, [editor, dragInfo]);

  const handleDragStart = useCallback(
    (ev: DragEvent) => {
      // ProseMirrorのDragStart参考に実装すれば良さそう
      // https://github.com/ProseMirror/prosemirror-view/blob/b2e782ae7c8013505ba05683b185886585ef5939/src/input.ts

      if (dragInfo === null) return;

      ev.dataTransfer.setDragImage(dragInfo.dom, 0, 0);
      ev.dataTransfer.effectAllowed = "copyMove";
      editor.view.dragging = new Dragging(
        dragInfo.nodeSelection.content(),
        true, // NOTE: 内部実装で使われていないので、基本的にmove一択になる
        dragInfo.nodeSelection
      );
    },
    [editor, dragInfo]
  );

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      const pos = editor.view.posAtCoords({
        left: ev.clientX,
        top: ev.clientY,
      });
      if (!pos) return;

      setTopBlockDragInfo(Math.min(pos.pos, editor.state.doc.content.size - 1));
    };

    const clearDragInfo = () => {
      setDragInfo(null);
    };

    editor.view.dom.addEventListener("mousemove", handleMouseMove);
    editor.view.dom.addEventListener("keydown", clearDragInfo);
    return () => {
      editor.view.dom.removeEventListener("mousemove", handleMouseMove);
      editor.view.dom.removeEventListener("keydown", clearDragInfo);
    };
  }, [editor, setTopBlockDragInfo]);

  if (dragInfo === null) return null;

  const rect = dragInfo.dom.getBoundingClientRect();

  return (
    <div
      draggable="true"
      className={styles.icon}
      onDragStart={handleDragStart}
      onClick={handleClick}
      style={{
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX - 40,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 9h16.5m-16.5 6.75h16.5"
        />
      </svg>
    </div>
  );
}
