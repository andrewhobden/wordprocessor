import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { FontFamily } from '@tiptap/extension-font-family'
import { useEffect, useCallback, useRef } from 'react'
import { saveDocument, getDocument } from '../lib/storage'
import { FontSize } from '../extensions/FontSize'
import { Toolbar } from './Toolbar'

interface EditorProps {
  documentId: string
  onTitleChange?: (title: string) => void
}

export const Editor = ({ documentId, onTitleChange }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start typing...',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
    ],
    content: '',
  })

  // Load document on mount
  useEffect(() => {
    const loadDocument = async () => {
      const doc = await getDocument(documentId)
      if (doc && editor) {
        editor.commands.setContent(doc.content)
      }
    }
    loadDocument()
  }, [documentId, editor])

  // Save document function
  const saveDoc = useCallback(async () => {
    if (!editor) return

    const content = editor.getHTML()

    // Extract title from first heading or first line
    const textContent = editor.getText()
    const title = textContent.split('\n')[0].slice(0, 100) || 'Untitled Document'

    await saveDocument({
      id: documentId,
      title,
      content,
    })

    onTitleChange?.(title)
  }, [editor, documentId, onTitleChange])

  // Auto-save on content change
  const saveTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!editor) return

    const handleUpdate = () => {
      // Clear existing timer
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      // Set new timer to save after 1 second of inactivity
      saveTimerRef.current = window.setTimeout(() => {
        saveDoc()
      }, 1000)
    }

    editor.on('update', handleUpdate)

    return () => {
      editor.off('update', handleUpdate)
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [editor, saveDoc])

  // Keyboard shortcuts for text alignment
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key.toLowerCase()) {
          case 'l':
            event.preventDefault()
            editor.chain().focus().setTextAlign('left').run()
            break
          case 'e':
            event.preventDefault()
            editor.chain().focus().setTextAlign('center').run()
            break
          case 'r':
            event.preventDefault()
            editor.chain().focus().setTextAlign('right').run()
            break
          case 'j':
            event.preventDefault()
            editor.chain().focus().setTextAlign('justify').run()
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className="editor-container">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
