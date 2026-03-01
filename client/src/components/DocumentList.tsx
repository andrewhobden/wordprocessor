import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllDocuments, deleteDocument, type Document } from '../lib/storage'
import './DocumentList.css'

export const DocumentList = () => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const loadDocuments = async () => {
    setLoading(true)
    const docs = await getAllDocuments()
    // Sort by most recently updated
    docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    setDocuments(docs)
    setLoading(false)
  }

  useEffect(() => {
    loadDocuments()
  }, [])

  const handleCreateNew = () => {
    const newId = crypto.randomUUID()
    navigate(`/document/${newId}`)
  }

  const handleOpenDocument = (id: string) => {
    navigate(`/document/${id}`)
  }

  const handleDeleteDocument = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this document?')) {
      await deleteDocument(id)
      await loadDocuments()
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="document-list-container">
        <div className="loading">Loading documents...</div>
      </div>
    )
  }

  return (
    <div className="document-list-container">
      <div className="document-list-header">
        <h1>My Documents</h1>
        <button onClick={handleCreateNew} className="btn-primary">
          New Document
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="empty-state">
          <p>No documents yet. Create your first document to get started!</p>
          <button onClick={handleCreateNew} className="btn-primary">
            Create Document
          </button>
        </div>
      ) : (
        <div className="document-grid">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="document-card"
              onClick={() => handleOpenDocument(doc.id)}
            >
              <div className="document-card-header">
                <h3>{doc.title}</h3>
                <button
                  onClick={(e) => handleDeleteDocument(e, doc.id)}
                  className="btn-delete"
                  aria-label="Delete document"
                >
                  ×
                </button>
              </div>
              <div className="document-card-footer">
                <span className="document-date">
                  Updated {formatDate(doc.updatedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
