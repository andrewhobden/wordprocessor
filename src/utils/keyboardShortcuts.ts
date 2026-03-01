/**
 * Keyboard shortcuts configuration and handler
 * Implements comprehensive keyboard navigation per WCAG 2.1 guidelines
 */

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  description: string;
  action: () => void;
}

export class KeyboardShortcutManager {
  private shortcuts: Map<string, KeyboardShortcut> = new Map();

  /**
   * Register a keyboard shortcut
   */
  register(shortcut: KeyboardShortcut): void {
    const key = this.createShortcutKey(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(shortcut: Omit<KeyboardShortcut, 'description' | 'action'>): void {
    const key = this.createShortcutKey(shortcut);
    this.shortcuts.delete(key);
  }

  /**
   * Handle keyboard event
   */
  handleKeyDown(event: KeyboardEvent): boolean {
    const key = this.createShortcutKeyFromEvent(event);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      event.stopPropagation();
      shortcut.action();
      return true;
    }

    return false;
  }

  /**
   * Get all registered shortcuts
   */
  getAllShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Create a unique key for a shortcut
   */
  private createShortcutKey(shortcut: Pick<KeyboardShortcut, 'key' | 'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey'>): string {
    const parts: string[] = [];

    if (shortcut.ctrlKey) parts.push('Ctrl');
    if (shortcut.shiftKey) parts.push('Shift');
    if (shortcut.altKey) parts.push('Alt');
    if (shortcut.metaKey) parts.push('Meta');
    parts.push(shortcut.key.toLowerCase());

    return parts.join('+');
  }

  /**
   * Create shortcut key from keyboard event
   */
  private createShortcutKeyFromEvent(event: KeyboardEvent): string {
    const parts: string[] = [];

    if (event.ctrlKey) parts.push('Ctrl');
    if (event.shiftKey) parts.push('Shift');
    if (event.altKey) parts.push('Alt');
    if (event.metaKey) parts.push('Meta');
    parts.push(event.key.toLowerCase());

    return parts.join('+');
  }
}

/**
 * Standard editor keyboard shortcuts
 */
export const STANDARD_SHORTCUTS = {
  // Text formatting
  BOLD: { key: 'b', ctrlKey: true, description: 'Toggle bold' },
  ITALIC: { key: 'i', ctrlKey: true, description: 'Toggle italic' },
  UNDERLINE: { key: 'u', ctrlKey: true, description: 'Toggle underline' },
  STRIKETHROUGH: { key: 's', ctrlKey: true, shiftKey: true, description: 'Toggle strikethrough' },

  // Document actions
  SAVE: { key: 's', ctrlKey: true, description: 'Save document' },
  SAVE_AS: { key: 's', ctrlKey: true, shiftKey: true, description: 'Save document as' },
  PRINT: { key: 'p', ctrlKey: true, description: 'Print document' },
  FIND: { key: 'f', ctrlKey: true, description: 'Find in document' },
  REPLACE: { key: 'h', ctrlKey: true, description: 'Find and replace' },

  // Edit actions
  UNDO: { key: 'z', ctrlKey: true, description: 'Undo' },
  REDO: { key: 'y', ctrlKey: true, description: 'Redo' },
  CUT: { key: 'x', ctrlKey: true, description: 'Cut' },
  COPY: { key: 'c', ctrlKey: true, description: 'Copy' },
  PASTE: { key: 'v', ctrlKey: true, description: 'Paste' },
  SELECT_ALL: { key: 'a', ctrlKey: true, description: 'Select all' },

  // Paragraph formatting
  ALIGN_LEFT: { key: 'l', ctrlKey: true, shiftKey: true, description: 'Align left' },
  ALIGN_CENTER: { key: 'e', ctrlKey: true, shiftKey: true, description: 'Align center' },
  ALIGN_RIGHT: { key: 'r', ctrlKey: true, shiftKey: true, description: 'Align right' },
  ALIGN_JUSTIFY: { key: 'j', ctrlKey: true, shiftKey: true, description: 'Justify' },

  // Lists
  BULLET_LIST: { key: '8', ctrlKey: true, shiftKey: true, description: 'Toggle bullet list' },
  ORDERED_LIST: { key: '7', ctrlKey: true, shiftKey: true, description: 'Toggle numbered list' },

  // Navigation
  FOCUS_TOOLBAR: { key: 'F10', description: 'Focus toolbar' },
  ESCAPE: { key: 'Escape', description: 'Close dialog or menu' },
};
