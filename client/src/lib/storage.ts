import { openDB } from 'idb'
import type { DBSchema, IDBPDatabase } from 'idb'

interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
}

interface WordProcessorDB extends DBSchema {
  documents: {
    key: string
    value: Document
    indexes: { 'by-updated': Date }
  }
}

let db: IDBPDatabase<WordProcessorDB> | null = null

async function getDB() {
  if (db) return db

  db = await openDB<WordProcessorDB>('wordprocessor', 1, {
    upgrade(db) {
      const store = db.createObjectStore('documents', { keyPath: 'id' })
      store.createIndex('by-updated', 'updatedAt')
    },
  })

  return db
}

export async function saveDocument(doc: Omit<Document, 'createdAt' | 'updatedAt'> & Partial<Pick<Document, 'createdAt' | 'updatedAt'>>): Promise<Document> {
  const db = await getDB()
  const now = new Date()

  const existing = await db.get('documents', doc.id)

  const document: Document = {
    ...doc,
    createdAt: existing?.createdAt || doc.createdAt || now,
    updatedAt: now,
  }

  await db.put('documents', document)
  return document
}

export async function getDocument(id: string): Promise<Document | undefined> {
  const db = await getDB()
  return db.get('documents', id)
}

export async function getAllDocuments(): Promise<Document[]> {
  const db = await getDB()
  return db.getAllFromIndex('documents', 'by-updated')
}

export async function deleteDocument(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('documents', id)
}

export type { Document }
