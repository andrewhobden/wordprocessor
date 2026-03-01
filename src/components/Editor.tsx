/**
 * Accessible Editor Component
 * TipTap editor with full WCAG 2.1 AA compliance
 */

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { announcer } from '../utils/announcer';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { STANDARD_SHORTCUTS } from '../utils/keyboardShortcuts';

interface EditorProps {
  content?: string;
  onUpdate?: (content: string) => void;
  editable?: boolean;
}

export function Editor({ content = '', onUpdate, editable = true }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editable,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-label': 'Document editor',
        'aria-multiline': 'true',
        'aria-describedby': 'editor-description',
        class: 'editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onUpdate?.(html);
    },
    onCreate: () => {
      announcer.announce('Editor ready. Press F10 to access toolbar', 'polite');
    },
  });

  // Register keyboard shortcuts
  useKeyboardShortcuts([
    {
      ...STANDARD_SHORTCUTS.BOLD,
      action: () => {
        editor?.chain().focus().toggleBold().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.ITALIC,
      action: () => {
        editor?.chain().focus().toggleItalic().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.UNDERLINE,
      action: () => {
        // Underline is not in StarterKit, would need extension
        announcer.announce('Underline formatting not yet implemented', 'polite');
      },
    },
    {
      ...STANDARD_SHORTCUTS.STRIKETHROUGH,
      action: () => {
        editor?.chain().focus().toggleStrike().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.UNDO,
      action: () => {
        editor?.chain().focus().undo().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.REDO,
      action: () => {
        editor?.chain().focus().redo().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.BULLET_LIST,
      action: () => {
        editor?.chain().focus().toggleBulletList().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.ORDERED_LIST,
      action: () => {
        editor?.chain().focus().toggleOrderedList().run();
      },
    },
    {
      ...STANDARD_SHORTCUTS.FOCUS_TOOLBAR,
      action: () => {
        const toolbar = document.getElementById('toolbar');
        if (toolbar) {
          toolbar.focus();
          announcer.announce('Toolbar focused', 'polite');
        }
      },
    },
  ]);

  useEffect(() => {
    return () => {
      if (editor) {
        editor.destroy();
      }
    };
  }, [editor]);

  return (
    <div id="editor" className="editor-wrapper">
      <div
        id="editor-description"
        className="sr-only"
      >
        Rich text editor. Use keyboard shortcuts for formatting. Press F10 to access the toolbar. Ctrl+B for bold, Ctrl+I for italic.
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

export default Editor;
