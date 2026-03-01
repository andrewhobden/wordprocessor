/**
 * Focus management hook for accessibility
 * Implements focus trapping, restoration, and management
 */

import { useEffect, useRef, useCallback } from 'react';

interface UseFocusManagementOptions {
  /**
   * Whether to trap focus within the element
   */
  trapFocus?: boolean;

  /**
   * Whether to restore focus when unmounting
   */
  restoreFocus?: boolean;

  /**
   * Whether to auto-focus the element on mount
   */
  autoFocus?: boolean;
}

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement(options: UseFocusManagementOptions = {}) {
  const {
    trapFocus = false,
    restoreFocus = true,
    autoFocus = false,
  } = options;

  const containerRef = useRef<HTMLElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  /**
   * Get all focusable elements within the container
   */
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter((element) => {
      // Filter out hidden elements
      const style = window.getComputedStyle(element);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }, []);

  /**
   * Handle tab key for focus trapping
   */
  const handleTabKey = useCallback(
    (event: KeyboardEvent) => {
      if (!trapFocus || event.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [trapFocus, getFocusableElements]
  );

  /**
   * Focus the first focusable element
   */
  const focusFirstElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [getFocusableElements]);

  /**
   * Focus the last focusable element
   */
  const focusLastElement = useCallback(() => {
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [getFocusableElements]);

  // Setup and cleanup
  useEffect(() => {
    // Store previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Auto-focus if requested
    if (autoFocus) {
      focusFirstElement();
    }

    // Add event listener for focus trapping
    if (trapFocus) {
      document.addEventListener('keydown', handleTabKey);
    }

    return () => {
      // Remove event listener
      if (trapFocus) {
        document.removeEventListener('keydown', handleTabKey);
      }

      // Restore focus if requested
      if (restoreFocus && previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [trapFocus, autoFocus, restoreFocus, handleTabKey, focusFirstElement]);

  return {
    containerRef,
    focusFirstElement,
    focusLastElement,
    getFocusableElements,
  };
}

/**
 * Hook for managing skip links
 */
export function useSkipLinks() {
  const skipToContent = useCallback((targetId: string) => {
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  return { skipToContent };
}
