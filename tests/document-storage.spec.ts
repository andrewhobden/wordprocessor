import { test, expect } from '@playwright/test';

test.describe('Document Storage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display document list on home page', async ({ page }) => {
    // Check for document list container
    const container = page.locator('.document-list-container');
    await expect(container).toBeVisible();
  });

  test('should show new document button', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /new document/i });
    await expect(newButton).toBeVisible();
  });

  test('should create a new document and navigate to editor', async ({ page }) => {
    const newButton = page.getByRole('button', { name: /new document/i });
    await newButton.click();

    // Should navigate to editor page with a document ID
    await page.waitForURL(/\/document\/.+/);

    // Editor should be visible
    const editor = page.locator('[contenteditable="true"]');
    await expect(editor).toBeVisible();
  });

  test('should save and persist document content', async ({ page, context }) => {
    // Create new document
    const newButton = page.getByRole('button', { name: /new document/i });
    await newButton.click();

    await page.waitForURL(/\/document\/.+/);

    // Type content
    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type('Test document content');

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Get the document ID from URL
    const url = page.url();
    const docId = url.split('/').pop();

    // Go back to list
    const backButton = page.getByRole('button', { name: /back to documents/i });
    await backButton.click();

    // Should see the document in the list
    await expect(page.locator('.document-card')).toBeVisible();

    // Click on the document to open it
    await page.locator('.document-card').first().click();

    // Should load the saved content
    await expect(editor).toContainText('Test document content');
  });

  test('should display document title from content', async ({ page }) => {
    // Create new document
    const newButton = page.getByRole('button', { name: /new document/i });
    await newButton.click();

    await page.waitForURL(/\/document\/.+/);

    // Type content
    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type('My Document Title');

    // Wait for auto-save
    await page.waitForTimeout(2000);

    // Go back to list
    const backButton = page.getByRole('button', { name: /back to documents/i });
    await backButton.click();

    // Should see the title in the document card
    await expect(page.locator('.document-card h3')).toContainText('My Document Title');
  });

  test('should delete document', async ({ page }) => {
    // Create a new document first
    const newButton = page.getByRole('button', { name: /new document/i });
    await newButton.click();

    await page.waitForURL(/\/document\/.+/);

    const editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type('Document to delete');

    await page.waitForTimeout(2000);

    // Go back
    const backButton = page.getByRole('button', { name: /back to documents/i });
    await backButton.click();

    // Wait for document list to load
    await page.waitForSelector('.document-card');

    // Count documents before delete
    const countBefore = await page.locator('.document-card').count();

    // Set up dialog handler before clicking
    page.once('dialog', dialog => dialog.accept());

    // Click delete button
    const deleteButton = page.locator('.btn-delete').first();
    await deleteButton.click();

    // Wait for the document to be removed from the list
    await page.waitForTimeout(1000);

    // Count should be less
    const countAfter = await page.locator('.document-card').count();
    expect(countAfter).toBeLessThan(countBefore);
  });

  test('should show empty state when no documents exist', async ({ page, context }) => {
    // Clear IndexedDB
    await context.clearCookies();
    await page.evaluate(() => {
      indexedDB.deleteDatabase('wordprocessor');
    });

    await page.reload();

    // Should show empty state
    const emptyState = page.locator('.empty-state');
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText(/no documents/i);
  });

  test('should sort documents by most recently updated', async ({ page }) => {
    // Create first document
    let newButton = page.getByRole('button', { name: /new document/i });
    await newButton.click();

    await page.waitForURL(/\/document\/.+/);

    let editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type('First document');
    await page.waitForTimeout(1500);

    // Go back
    let backButton = page.getByRole('button', { name: /back to documents/i });
    await backButton.click();

    // Wait a bit
    await page.waitForTimeout(500);

    // Create second document
    newButton = page.getByRole('button', { name: /new document/i });
    await newButton.click();

    await page.waitForURL(/\/document\/.+/);

    editor = page.locator('[contenteditable="true"]');
    await editor.click();
    await editor.type('Second document');
    await page.waitForTimeout(1500);

    // Go back
    backButton = page.getByRole('button', { name: /back to documents/i });
    await backButton.click();

    // The most recently updated (Second document) should be first
    const firstCard = page.locator('.document-card').first();
    await expect(firstCard.locator('h3')).toContainText('Second document');
  });
});
