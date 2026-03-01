import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Editor } from '../components/Editor'

export const EditorPage = () => {
  const { documentId } = useParams<{ documentId: string }>()
  const navigate = useNavigate()
  const [title, setTitle] = useState('Untitled Document')

  if (!documentId) {
    // Redirect to home if no document ID
    navigate('/')
    return null
  }

  return (
    <div className="editor-page">
      <div className="editor-header">
        <button onClick={() => navigate('/')} className="btn-back">
          ← Back to Documents
        </button>
        <h1>{title}</h1>
      </div>
      <Editor documentId={documentId} onTitleChange={setTitle} />
    </div>
  )
}
