import MarkdownEditor from './components/MarkdownEditor'
import './App.css'

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Word Processor</h1>
      </header>
      <main className="app-main">
        <MarkdownEditor />
      </main>
    </div>
  )
}

export default App
