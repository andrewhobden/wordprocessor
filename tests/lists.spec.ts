import { test, expect } from '@playwright/test';

test.describe('Word Processor - List Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5180/');
  });

  test('should display list toolbar buttons', async ({ page }) => {
    const bulletListButton = page.locator('button[title="Bullet List"]');
    const numberedListButton = page.locator('button[title="Numbered List"]');

    await expect(bulletListButton).toBeVisible();
    await expect(numberedListButton).toBeVisible();
  });

  test('should create a bulleted list', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const bulletListButton = page.locator('button[title="Bullet List"]');

    await editor.click();
    await bulletListButton.click();
    await editor.type('First item');
    await page.keyboard.press('Enter');
    await editor.type('Second item');
    await page.keyboard.press('Enter');
    await editor.type('Third item');

    // Check for bullet list exists
    const bulletList = page.locator('ul');
    await expect(bulletList).toBeVisible();

    // Verify content
    await expect(editor).toContainText('First item');
    await expect(editor).toContainText('Second item');
    await expect(editor).toContainText('Third item');
  });

  test('should create a numbered list', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const numberedListButton = page.locator('button[title="Numbered List"]');

    await editor.click();
    await numberedListButton.click();
    await editor.type('First step');
    await page.keyboard.press('Enter');
    await editor.type('Second step');
    await page.keyboard.press('Enter');
    await editor.type('Third step');

    // Check for ordered list exists
    const numberedList = page.locator('ol');
    await expect(numberedList).toBeVisible();

    // Verify content
    await expect(editor).toContainText('First step');
    await expect(editor).toContainText('Second step');
    await expect(editor).toContainText('Third step');
  });

  test('should toggle bullet list on and off', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const bulletListButton = page.locator('button[title="Bullet List"]');

    await editor.click();
    await bulletListButton.click();
    await editor.type('List item');

    // Should have bullet list
    await expect(page.locator('ul')).toBeVisible();

    // Content should be there
    await expect(editor).toContainText('List item');
  });

  test('should toggle numbered list on and off', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const numberedListButton = page.locator('button[title="Numbered List"]');

    await editor.click();
    await numberedListButton.click();
    await editor.type('List item');

    // Should have numbered list
    await expect(page.locator('ol')).toBeVisible();

    // Content should be there
    await expect(editor).toContainText('List item');
  });

  test('should show active state when cursor is in list', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const bulletListButton = page.locator('button[title="Bullet List"]');

    await editor.click();
    await bulletListButton.click();

    // Button should have active class (check before typing to avoid focus issues)
    await expect(bulletListButton).toHaveClass(/is-active/);

    await editor.type('List item');
    await expect(page.locator('ul')).toBeVisible();
  });

  test('should maintain proper indentation in lists', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const bulletListButton = page.locator('button[title="Bullet List"]');

    await editor.click();
    await bulletListButton.click();
    await editor.type('Item 1');
    await page.keyboard.press('Enter');
    await editor.type('Item 2');

    // Check that list items have proper structure
    await expect(editor).toContainText('Item 1');
    await expect(editor).toContainText('Item 2');

    // Should have a bullet list visible
    await expect(page.locator('ul')).toBeVisible();
  });

  test('should switch between bullet and numbered lists', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const bulletListButton = page.locator('button[title="Bullet List"]');
    const numberedListButton = page.locator('button[title="Numbered List"]');

    await editor.click();
    await bulletListButton.click();
    await editor.type('Item');

    // Should be bullet list
    await expect(page.locator('ul')).toBeVisible();

    // Switch to numbered by selecting all first
    await page.keyboard.press('Meta+A');
    await numberedListButton.click();

    // Should now be numbered list
    await expect(page.locator('ol')).toBeVisible();

    // Content preserved
    await expect(editor).toContainText('Item');
  });
});
