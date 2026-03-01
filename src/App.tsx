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
    autofocus: 'end',
  })

  const exportToPlainText = () => {
    if (!editor) return
    const text = editor.getText()
    downloadFile(text, 'document.txt', 'text/plain')
  }

  const exportToHTML = () => {
    if (!editor) return
    const html = editor.getHTML()
    downloadFile(html, 'document.html', 'text/html')
  }

  const exportToJSON = () => {
    if (!editor) return
    const json = JSON.stringify(editor.getJSON(), null, 2)
    downloadFile(json, 'document.json', 'application/json')
  }

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

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
        <div className="export-toolbar">
          <button onClick={exportToPlainText} className="export-button">
            Export as Text
          </button>
          <button onClick={exportToHTML} className="export-button">
            Export as HTML
          </button>
          <button onClick={exportToJSON} className="export-button">
            Export as JSON
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default App
