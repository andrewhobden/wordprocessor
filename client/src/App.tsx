import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DocumentListPage } from './pages/DocumentListPage'
import { EditorPage } from './pages/EditorPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DocumentListPage />} />
        <Route path="/document/:documentId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
