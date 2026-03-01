# Word Processor

A web-based word processor app written in TypeScript for the client with a Node backend for server-side functionality.

## Features

### Markdown Mode with WYSIWYG Toggle

This word processor includes a powerful markdown editing mode that appeals to developers and technical writers:

- **Dual Editing Modes**:
  - **WYSIWYG Mode**: Rich text editing with visual formatting
  - **Markdown Mode**: Raw markdown editing with syntax highlighting

- **Seamless Mode Switching**: Toggle between WYSIWYG and Markdown modes with a single click

- **Import/Export Markdown Files**:
  - Export your documents as `.md` files
  - Import existing markdown files directly into the editor

- **Real-time Conversion**: Content is automatically converted between HTML and Markdown when switching modes

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Editor**: TipTap (ProseMirror wrapper)
- **Build Tool**: Vite
- **Styling**: CSS

## Project Structure

```
wordprocessor/
├── src/
│   ├── components/
│   │   ├── MarkdownEditor.tsx    # Main editor component
│   │   └── MarkdownEditor.css    # Editor styles
│   ├── App.tsx                   # App component
│   ├── App.css                   # App styles
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Usage

1. Start the development server with `npm run dev`
2. Open your browser to the local development URL
3. Begin typing in either WYSIWYG or Markdown mode
4. Toggle between modes using the "Switch to Markdown" / "Switch to WYSIWYG" button
5. Export your work as a `.md` file using the "Export .md" button
6. Import existing markdown files using the "Import .md" button
