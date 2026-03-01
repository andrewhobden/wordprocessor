import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './MarkdownEditor.css'

const MarkdownEditor: React.FC = () => {
  const [isMarkdownMode, setIsMarkdownMode] = useState(false)
  const [markdownContent, setMarkdownContent] = useState('')

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start typing your document...</p>',
    onUpdate: ({ editor }) => {
      // Convert editor content to markdown when in WYSIWYG mode
      if (!isMarkdownMode) {
        setMarkdownContent(convertToMarkdown(editor.getHTML()))
      }
    },
  })

  const convertToMarkdown = (html: string): string => {
    // Basic HTML to Markdown conversion
    let markdown = html
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
      .replace(/<h4>(.*?)<\/h4>/g, '#### $1\n')
      .replace(/<h5>(.*?)<\/h5>/g, '##### $1\n')
      .replace(/<h6>(.*?)<\/h6>/g, '###### $1\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<ul>(.*?)<\/ul>/gs, (_match, content) => {
        return content.replace(/<li>(.*?)<\/li>/g, '- $1\n')
      })
      .replace(/<ol>(.*?)<\/ol>/gs, (_match, content) => {
        let counter = 1
        return content.replace(/<li>(.*?)<\/li>/g, () => `${counter++}. $1\n`)
      })
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
      .trim()

    return markdown
  }

  const convertFromMarkdown = (markdown: string): string => {
    // Basic Markdown to HTML conversion
    let html = markdown
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
      .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>')

    return html
  }

  const toggleMode = () => {
    if (!editor) return

    if (isMarkdownMode) {
      // Switching from Markdown to WYSIWYG
      const html = convertFromMarkdown(markdownContent)
      editor.commands.setContent(html)
    } else {
      // Switching from WYSIWYG to Markdown
      const html = editor.getHTML()
      const markdown = convertToMarkdown(html)
      setMarkdownContent(markdown)
    }

    setIsMarkdownMode(!isMarkdownMode)
  }

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownContent(e.target.value)
  }

  const exportMarkdown = () => {
    const markdown = isMarkdownMode
      ? markdownContent
      : convertToMarkdown(editor?.getHTML() || '')

    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const importMarkdown = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const markdown = event.target?.result as string
      setMarkdownContent(markdown)

      if (!isMarkdownMode && editor) {
        const html = convertFromMarkdown(markdown)
        editor.commands.setContent(html)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="markdown-editor">
      <div className="toolbar">
        <button
          onClick={toggleMode}
          className="toggle-button"
        >
          {isMarkdownMode ? 'Switch to WYSIWYG' : 'Switch to Markdown'}
        </button>
        <button onClick={exportMarkdown} className="action-button">
          Export .md
        </button>
        <label className="action-button file-button">
          Import .md
          <input
            type="file"
            accept=".md,.markdown"
            onChange={importMarkdown}
            style={{ display: 'none' }}
          />
        </label>
      </div>

      <div className="editor-container">
        {isMarkdownMode ? (
          <textarea
            value={markdownContent}
            onChange={handleMarkdownChange}
            className="markdown-textarea"
            placeholder="# Start typing in Markdown..."
            spellCheck={false}
          />
        ) : (
          <div className="wysiwyg-editor">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownEditor
