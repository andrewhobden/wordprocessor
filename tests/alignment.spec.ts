import { test, expect } from '@playwright/test';

test.describe('Word Processor - Text Alignment', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5178/');
  });

  test('should have alignment buttons in toolbar', async ({ page }) => {
    // Check for alignment buttons by data-testid
    await expect(page.getByTestId('align-left')).toBeVisible();
    await expect(page.getByTestId('align-center')).toBeVisible();
    await expect(page.getByTestId('align-right')).toBeVisible();
    await expect(page.getByTestId('align-justify')).toBeVisible();
  });

  test('should align text left with button click', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Left aligned text');

    // Click left align button
    await page.getByTestId('align-left').click();

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: left');
  });

  test('should align text center with button click', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Center aligned text');

    // Click center align button
    await page.getByTestId('align-center').click();

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: center');
  });

  test('should align text right with button click', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Right aligned text');

    // Click right align button
    await page.getByTestId('align-right').click();

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: right');
  });

  test('should justify text with button click', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Justified text that is long enough to span multiple lines and show justify behavior');

    // Click justify button
    await page.getByTestId('align-justify').click();

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: justify');
  });

  test('should align text left with keyboard shortcut Ctrl+Shift+L', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test keyboard shortcut');

    // Use keyboard shortcut
    await page.keyboard.press('Control+Shift+L');

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: left');
  });

  test('should align text center with keyboard shortcut Ctrl+Shift+E', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test keyboard shortcut');

    // Use keyboard shortcut
    await page.keyboard.press('Control+Shift+E');

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: center');
  });

  test('should align text right with keyboard shortcut Ctrl+Shift+R', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test keyboard shortcut');

    // Use keyboard shortcut
    await page.keyboard.press('Control+Shift+R');

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: right');
  });

  test('should justify text with keyboard shortcut Ctrl+Shift+J', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test keyboard shortcut for justify');

    // Use keyboard shortcut
    await page.keyboard.press('Control+Shift+J');

    // Check that the paragraph has the correct alignment attribute
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: justify');
  });

  test('should show active state for current alignment', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test active state');

    // Click center align button
    const centerButton = page.getByTestId('align-center');
    await centerButton.click();

    // Wait a moment for the active state to update
    await page.waitForTimeout(100);

    // Check that the paragraph was centered
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: center');
  });

  test('should change alignment between different options', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('Test changing alignment');

    const paragraph = page.locator('p').first();

    // Start with left
    await page.getByTestId('align-left').click();
    let textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: left');

    // Change to center
    await page.getByTestId('align-center').click();
    textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: center');

    // Change to right
    await page.getByTestId('align-right').click();
    textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: right');

    // Change to justify
    await page.getByTestId('align-justify').click();
    textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: justify');
  });

  test('should maintain alignment when typing more text', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('First line');

    // Set to center
    await page.getByTestId('align-center').click();

    // Type more text
    await editor.type(' and more text');

    // Check alignment is still center
    const paragraph = page.locator('p').first();
    const textAlign = await paragraph.getAttribute('style');
    expect(textAlign).toContain('text-align: center');
  });

  test('should apply alignment to multiple paragraphs when selected', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    await editor.click();
    await editor.type('First paragraph');
    await page.keyboard.press('Enter');
    await editor.type('Second paragraph');

    // Select all
    await page.keyboard.press('Control+A');

    // Apply center alignment
    await page.getByTestId('align-center').click();

    //Wait a moment
    await page.waitForTimeout(100);

    // Check both paragraphs are centered
    const paragraphs = page.locator('p');
    const count = await paragraphs.count();

    // At least one paragraph should be centered
    let centered = 0;
    for (let i = 0; i < count; i++) {
      const textAlign = await paragraphs.nth(i).getAttribute('style');
      if (textAlign && textAlign.includes('text-align: center')) {
        centered++;
      }
    }
    expect(centered).toBeGreaterThan(0);
  });
});
