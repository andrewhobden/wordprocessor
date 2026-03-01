/**
 * Accessible Header Component
 * Site header with navigation and branding
 */

// Header component - accessible site header

export function Header() {
  return (
    <header role="banner" className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          <span aria-label="Word Processor">Word Processor</span>
        </h1>
        <nav role="navigation" aria-label="Main navigation">
          <ul className="nav-list">
            <li>
              <button
                type="button"
                aria-label="New document"
                title="New document"
              >
                New
              </button>
            </li>
            <li>
              <button
                type="button"
                aria-label="Open document"
                title="Open document"
              >
                Open
              </button>
            </li>
            <li>
              <button
                type="button"
                aria-label="Save document"
                title="Save document (Ctrl+S)"
              >
                Save
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
