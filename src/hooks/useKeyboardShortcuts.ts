/**
 * Custom hook for keyboard shortcuts
 */

import { useEffect } from 'react';
import { KeyboardShortcutManager, KeyboardShortcut } from '../utils/keyboardShortcuts';
import { announcer } from '../utils/announcer';

const shortcutManager = new KeyboardShortcutManager();

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    // Register all shortcuts
    shortcuts.forEach((shortcut) => {
      shortcutManager.register(shortcut);
    });

    // Add global event listener
    const handleKeyDown = (event: KeyboardEvent) => {
      const handled = shortcutManager.handleKeyDown(event);
      if (handled) {
        // Find the matching shortcut to announce it
        const matchingShortcut = shortcuts.find((s) => {
          const matches =
            s.key.toLowerCase() === event.key.toLowerCase() &&
            !!s.ctrlKey === event.ctrlKey &&
            !!s.shiftKey === event.shiftKey &&
            !!s.altKey === event.altKey &&
            !!s.metaKey === event.metaKey;
          return matches;
        });

        if (matchingShortcut) {
          announcer.announceShortcut(matchingShortcut.description);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      // Unregister shortcuts
      shortcuts.forEach((shortcut) => {
        shortcutManager.unregister(shortcut);
      });

      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts]);

  return shortcutManager;
}
