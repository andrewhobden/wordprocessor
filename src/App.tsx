/**
 * Main App Component
 * Accessible word processor application
 */

import { useState } from 'react';
import { SkipLinks } from './components/SkipLinks';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './styles/App.css';

function App() {
  const [content, setContent] = useState('');

  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        role: 'textbox',
        'aria-label': 'Document editor',
        'aria-multiline': 'true',
        class: 'editor-content',
      },
    },
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <>
      <SkipLinks />
      <Header />
      <main id="main-content" role="main" className="app-main" tabIndex={-1}>
        <div className="editor-container">
          <Toolbar editor={editor} />
          <div className="editor-area">
            {editor && <Editor content={content} onUpdate={setContent} />}
          </div>
        </div>
      </main>
      <footer role="contentinfo" className="app-footer">
        <p>
          <span className="sr-only">Accessibility information: </span>
          WCAG 2.1 AA Compliant • Full keyboard navigation • Screen reader optimized
        </p>
      </footer>
    </>
  );
}

export default App;
