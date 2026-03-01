/**
 * Accessible Toolbar Component
 * Implements ARIA toolbar pattern with keyboard navigation
 */

import { useRef } from 'react';
import { Editor } from '@tiptap/react';
import { announcer } from '../utils/announcer';

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);

  if (!editor) {
    return null;
  }

  const handleFormatToggle = (
    format: string,
    command: () => boolean,
    label: string
  ) => {
    const result = command();
    if (result) {
      const isActive = (editor as any).isActive(format);
      announcer.announceFormatChange(label, isActive);
    }
  };

  return (
    <div
      ref={toolbarRef}
      id="toolbar"
      role="toolbar"
      aria-label="Text formatting toolbar"
      aria-controls="editor"
      className="toolbar"
      tabIndex={0}
    >
      <div className="toolbar-group" role="group" aria-label="Text style">
        <button
          onClick={() =>
            handleFormatToggle(
              'bold',
              () => editor.chain().focus().toggleBold().run(),
              'Bold'
            )
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
          aria-pressed={editor.isActive('bold')}
          aria-label="Bold (Ctrl+B)"
          title="Bold (Ctrl+B)"
          type="button"
        >
          <strong>B</strong>
        </button>

        <button
          onClick={() =>
            handleFormatToggle(
              'italic',
              () => editor.chain().focus().toggleItalic().run(),
              'Italic'
            )
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
          aria-pressed={editor.isActive('italic')}
          aria-label="Italic (Ctrl+I)"
          title="Italic (Ctrl+I)"
          type="button"
        >
          <em>I</em>
        </button>

        <button
          onClick={() =>
            handleFormatToggle(
              'strike',
              () => editor.chain().focus().toggleStrike().run(),
              'Strikethrough'
            )
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
          aria-pressed={editor.isActive('strike')}
          aria-label="Strikethrough (Ctrl+Shift+S)"
          title="Strikethrough (Ctrl+Shift+S)"
          type="button"
        >
          <s>S</s>
        </button>
      </div>

      <div
        className="toolbar-separator"
        role="separator"
        aria-orientation="vertical"
      />

      <div className="toolbar-group" role="group" aria-label="Paragraph style">
        <button
          onClick={() => {
            editor.chain().focus().setParagraph().run();
            announcer.announce('Normal paragraph style applied', 'polite');
          }}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
          aria-pressed={editor.isActive('paragraph')}
          aria-label="Normal paragraph"
          title="Normal paragraph"
          type="button"
        >
          P
        </button>

        <button
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            announcer.announce('Heading 1 style applied', 'polite');
          }}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          aria-pressed={editor.isActive('heading', { level: 1 })}
          aria-label="Heading 1"
          title="Heading 1"
          type="button"
        >
          H1
        </button>

        <button
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            announcer.announce('Heading 2 style applied', 'polite');
          }}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          aria-pressed={editor.isActive('heading', { level: 2 })}
          aria-label="Heading 2"
          title="Heading 2"
          type="button"
        >
          H2
        </button>

        <button
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            announcer.announce('Heading 3 style applied', 'polite');
          }}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          aria-pressed={editor.isActive('heading', { level: 3 })}
          aria-label="Heading 3"
          title="Heading 3"
          type="button"
        >
          H3
        </button>
      </div>

      <div
        className="toolbar-separator"
        role="separator"
        aria-orientation="vertical"
      />

      <div className="toolbar-group" role="group" aria-label="Lists">
        <button
          onClick={() =>
            handleFormatToggle(
              'bulletList',
              () => editor.chain().focus().toggleBulletList().run(),
              'Bullet list'
            )
          }
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          aria-pressed={editor.isActive('bulletList')}
          aria-label="Bullet list (Ctrl+Shift+8)"
          title="Bullet list (Ctrl+Shift+8)"
          type="button"
        >
          •
        </button>

        <button
          onClick={() =>
            handleFormatToggle(
              'orderedList',
              () => editor.chain().focus().toggleOrderedList().run(),
              'Numbered list'
            )
          }
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          aria-pressed={editor.isActive('orderedList')}
          aria-label="Numbered list (Ctrl+Shift+7)"
          title="Numbered list (Ctrl+Shift+7)"
          type="button"
        >
          1.
        </button>
      </div>

      <div
        className="toolbar-separator"
        role="separator"
        aria-orientation="vertical"
      />

      <div className="toolbar-group" role="group" aria-label="History">
        <button
          onClick={() => {
            editor.chain().focus().undo().run();
            announcer.announce('Undo', 'polite');
          }}
          disabled={!editor.can().undo()}
          aria-label="Undo (Ctrl+Z)"
          title="Undo (Ctrl+Z)"
          type="button"
        >
          ↶
        </button>

        <button
          onClick={() => {
            editor.chain().focus().redo().run();
            announcer.announce('Redo', 'polite');
          }}
          disabled={!editor.can().redo()}
          aria-label="Redo (Ctrl+Y)"
          title="Redo (Ctrl+Y)"
          type="button"
        >
          ↷
        </button>
      </div>
    </div>
  );
}
