import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('Word Processor - Export Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5181/');
  });

  test('should display export buttons', async ({ page }) => {
    const exportTextButton = page.getByRole('button', { name: /export as text/i });
    const exportHTMLButton = page.getByRole('button', { name: /export as html/i });
    const exportJSONButton = page.getByRole('button', { name: /export as json/i });

    await expect(exportTextButton).toBeVisible();
    await expect(exportHTMLButton).toBeVisible();
    await expect(exportJSONButton).toBeVisible();
  });

  test('should export to plain text', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test export content');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as text/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('document.txt');
  });

  test('should export to HTML', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('HTML export test');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as html/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('document.html');
  });

  test('should export to JSON', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('JSON export test');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as json/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('document.json');
  });

  test('exported text should contain typed content', async ({ page }) => {
    const testContent = 'This is my document content';
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type(testContent);

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as text/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain(testContent);
    }
  });

  test('exported HTML should be valid HTML', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('HTML content test');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as html/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('<p>');
      expect(content).toContain('HTML content test');
    }
  });

  test('exported JSON should be valid JSON', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('JSON content test');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as json/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      const json = JSON.parse(content);
      expect(json).toHaveProperty('type');
      expect(json).toHaveProperty('content');
    }
  });

  test('should handle empty document export', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as text/i }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe('document.txt');
  });

  test('should handle multiline content in text export', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Line 1');
    await page.keyboard.press('Enter');
    await editor.type('Line 2');
    await page.keyboard.press('Enter');
    await editor.type('Line 3');

    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name: /export as text/i }).click();
    const download = await downloadPromise;

    const downloadPath = await download.path();
    if (downloadPath) {
      const content = fs.readFileSync(downloadPath, 'utf-8');
      expect(content).toContain('Line 1');
      expect(content).toContain('Line 2');
      expect(content).toContain('Line 3');
    }
  });

  test('export buttons should be clickable multiple times', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Export multiple times');

    const exportButton = page.getByRole('button', { name: /export as text/i });

    let downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    await downloadPromise;

    downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    await downloadPromise;

    // Should be able to export multiple times without errors
    await expect(exportButton).toBeEnabled();
  });
});
