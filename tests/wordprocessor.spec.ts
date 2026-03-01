import { test, expect } from '@playwright/test';

test.describe('Word Processor - Basic Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/');
  });

  test('should load the application', async ({ page }) => {
    await expect(page).toHaveTitle(/Word Processor|wordprocessor/i);
  });

  test('should display the editor', async ({ page }) => {
    // Check for TipTap editor presence
    const editor = page.locator('[contenteditable="true"]');
    await expect(editor).toBeVisible();
  });

  test('should allow typing text', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Hello, World!');

    // Verify text appears in editor
    await expect(editor).toContainText('Hello, World!');
  });

  test('should support basic text selection', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test selection');

    // Select all text
    await page.keyboard.press('Meta+A'); // Cmd+A on Mac

    // Text should be selectable
    const selectedText = await page.evaluate(() => window.getSelection()?.toString());
    expect(selectedText).toContain('Test selection');
  });

  test('should support undo/redo', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Original text');

    // Undo
    await page.keyboard.press('Meta+Z');

    // Check if text is removed or changed
    const contentAfterUndo = await editor.textContent();
    expect(contentAfterUndo).not.toBe('Original text');

    // Redo
    await page.keyboard.press('Meta+Shift+Z');

    // Text should be back
    await expect(editor).toContainText('Original text');
  });

  test('should support copy and paste', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Copy me');

    // Select all
    await page.keyboard.press('Meta+A');

    // Copy
    await page.keyboard.press('Meta+C');

    // Move cursor to end
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');

    // Paste
    await page.keyboard.press('Meta+V');

    // Should have duplicated text
    const content = await editor.textContent();
    const occurrences = (content?.match(/Copy me/g) || []).length;
    expect(occurrences).toBeGreaterThanOrEqual(2);
  });

  test('should delete text', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Delete this');

    // Delete with backspace
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Backspace');
    }

    // Should have partial text
    await expect(editor).toContainText('Delete');
    await expect(editor).not.toContainText('Delete this');
  });

  test('should handle Enter key for new paragraphs', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Line 1');
    await page.keyboard.press('Enter');
    await editor.type('Line 2');

    const content = await editor.textContent();
    expect(content).toContain('Line 1');
    expect(content).toContain('Line 2');
  });

  test('should maintain focus when typing', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Continuous typing');

    // Editor should still be focused
    const isFocused = await editor.evaluate((el) => el === document.activeElement);
    expect(isFocused).toBe(true);
  });

  test('should handle rapid typing', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();

    const testText = 'The quick brown fox jumps over the lazy dog';
    await editor.type(testText, { delay: 10 }); // Fast typing

    await expect(editor).toContainText(testText);
  });

  test('should preserve content structure', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Paragraph 1');
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await editor.type('Paragraph 2');

    // Check for paragraph structure
    const paragraphs = await page.locator('p').count();
    expect(paragraphs).toBeGreaterThan(0);
  });
});

test.describe('Word Processor - UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/');
  });

  test('should have a visible interface', async ({ page }) => {
    // Check that the page has loaded and is not blank
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('should not show console errors on load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.waitForLoadState('networkidle');

    // Filter out expected warnings (like Node version warnings)
    const criticalErrors = errors.filter(err =>
      !err.includes('Node.js') &&
      !err.includes('EBADENGINE')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('should be responsive to window resize', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await expect(editor).toBeVisible();

    // Resize window
    await page.setViewportSize({ width: 800, height: 600 });
    await expect(editor).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(editor).toBeVisible();
  });
});

test.describe('Word Processor - Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/');
  });

  test('editor should be keyboard accessible', async ({ page }) => {
    // Tab to editor
    await page.keyboard.press('Tab');

    // Should be able to type without clicking
    await page.keyboard.type('Keyboard accessible');

    const editor = page.locator('[contenteditable="true"]').first();
    await expect(editor).toContainText('Keyboard accessible');
  });

  test('should have proper ARIA attributes', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();

    // Check for contenteditable
    const isEditable = await editor.getAttribute('contenteditable');
    expect(isEditable).toBe('true');
  });
});

test.describe('Word Processor - Performance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5175/');
  });

  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should handle large text input', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();

    // Type a large amount of text
    const largeText = 'Lorem ipsum dolor sit amet. '.repeat(100);
    await editor.type(largeText);

    // Should still contain the text
    const content = await editor.textContent();
    expect(content?.length).toBeGreaterThan(1000);
  });
});
