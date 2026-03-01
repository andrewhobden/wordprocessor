import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [, setUpdateCounter] = useState(0)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none',
      },
    },
    onUpdate: () => {
      setUpdateCounter(c => c + 1)
    },
    onSelectionUpdate: () => {
      setUpdateCounter(c => c + 1)
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="app">
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          •
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Numbered List"
        >
          1.
        </button>
      </div>
      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default App
