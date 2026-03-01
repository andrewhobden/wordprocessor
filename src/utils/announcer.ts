/**
 * Screen reader announcer utility
 * Creates live regions for screen reader announcements
 * Follows WCAG 2.1 guidelines for ARIA live regions
 */

type AnnouncementPriority = 'polite' | 'assertive';

class ScreenReaderAnnouncer {
  private politeRegion: HTMLDivElement | null = null;
  private assertiveRegion: HTMLDivElement | null = null;

  constructor() {
    this.initializeLiveRegions();
  }

  /**
   * Create ARIA live regions for announcements
   */
  private initializeLiveRegions(): void {
    // Polite announcements (don't interrupt)
    this.politeRegion = document.createElement('div');
    this.politeRegion.setAttribute('role', 'status');
    this.politeRegion.setAttribute('aria-live', 'polite');
    this.politeRegion.setAttribute('aria-atomic', 'true');
    this.politeRegion.className = 'sr-only';
    document.body.appendChild(this.politeRegion);

    // Assertive announcements (interrupt current reading)
    this.assertiveRegion = document.createElement('div');
    this.assertiveRegion.setAttribute('role', 'alert');
    this.assertiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveRegion.className = 'sr-only';
    document.body.appendChild(this.assertiveRegion);
  }

  /**
   * Announce a message to screen readers
   * @param message - The message to announce
   * @param priority - 'polite' (default) or 'assertive'
   */
  announce(message: string, priority: AnnouncementPriority = 'polite'): void {
    const region = priority === 'assertive' ? this.assertiveRegion : this.politeRegion;

    if (!region) {
      console.warn('Live region not initialized');
      return;
    }

    // Clear previous message
    region.textContent = '';

    // Set new message after a brief delay to ensure screen readers detect the change
    setTimeout(() => {
      region.textContent = message;
    }, 100);

    // Clear message after announcement to avoid confusion on page navigation
    setTimeout(() => {
      region.textContent = '';
    }, 5000);
  }

  /**
   * Announce document actions (save, export, etc.)
   */
  announceDocumentAction(action: string, status: 'success' | 'error' | 'pending'): void {
    const statusMessages = {
      success: `${action} completed successfully`,
      error: `${action} failed. Please try again`,
      pending: `${action} in progress`,
    };

    this.announce(statusMessages[status], status === 'error' ? 'assertive' : 'polite');
  }

  /**
   * Announce formatting changes
   */
  announceFormatChange(format: string, enabled: boolean): void {
    this.announce(`${format} ${enabled ? 'enabled' : 'disabled'}`, 'polite');
  }

  /**
   * Announce selection changes
   */
  announceSelection(wordCount: number): void {
    if (wordCount === 0) {
      this.announce('Selection cleared', 'polite');
    } else {
      this.announce(`Selected ${wordCount} word${wordCount !== 1 ? 's' : ''}`, 'polite');
    }
  }

  /**
   * Announce keyboard shortcut actions
   */
  announceShortcut(action: string): void {
    this.announce(action, 'polite');
  }

  /**
   * Clean up live regions
   */
  destroy(): void {
    if (this.politeRegion) {
      document.body.removeChild(this.politeRegion);
      this.politeRegion = null;
    }
    if (this.assertiveRegion) {
      document.body.removeChild(this.assertiveRegion);
      this.assertiveRegion = null;
    }
  }
}

// Export singleton instance
export const announcer = new ScreenReaderAnnouncer();
