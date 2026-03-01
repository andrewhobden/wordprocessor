import { Editor } from '@tiptap/react'

interface ToolbarProps {
  editor: Editor | null
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  if (!editor) {
    return null
  }

  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
          title="Underline"
        >
          U
        </button>
      </div>

      <div className="toolbar-group">
        <select
          onChange={(e) => {
            if (e.target.value === '') {
              editor.chain().focus().unsetFontFamily().run()
            } else {
              editor.chain().focus().setFontFamily(e.target.value).run()
            }
          }}
          value={editor.getAttributes('textStyle').fontFamily || ''}
          title="Font Family"
        >
          <option value="">Default</option>
          <option value="Inter">Inter</option>
          <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
          <option value="cursive">Cursive</option>
        </select>

        <select
          onChange={(e) => {
            const level = parseInt(e.target.value)
            if (level === 0) {
              editor.chain().focus().setParagraph().run()
            } else {
              editor.chain().focus().toggleHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run()
            }
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' :
            editor.isActive('heading', { level: 5 }) ? '5' :
            editor.isActive('heading', { level: 6 }) ? '6' :
            '0'
          }
          title="Font Size"
        >
          <option value="0">Normal</option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
      </div>
    </div>
  )
}
