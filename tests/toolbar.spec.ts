import { test, expect } from '@playwright/test';

test.describe('Toolbar - Text Formatting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5178/');
  });

  test('should display toolbar with formatting buttons', async ({ page }) => {
    // Check for toolbar presence
    const toolbar = page.locator('.toolbar');
    await expect(toolbar).toBeVisible();

    // Check for bold button
    const boldButton = page.locator('.toolbar button[title="Bold"]');
    await expect(boldButton).toBeVisible();
    await expect(boldButton).toContainText('B');

    // Check for italic button
    const italicButton = page.locator('.toolbar button[title="Italic"]');
    await expect(italicButton).toBeVisible();
    await expect(italicButton).toContainText('I');

    // Check for underline button
    const underlineButton = page.locator('.toolbar button[title="Underline"]');
    await expect(underlineButton).toBeVisible();
    await expect(underlineButton).toContainText('U');
  });

  test('should apply bold formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const boldButton = page.locator('.toolbar button[title="Bold"]');

    // Type some text
    await editor.click();
    await editor.type('Bold text');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Click bold button
    await boldButton.click();

    // Check if button is active
    await expect(boldButton).toHaveClass(/is-active/);

    // Check if text has bold formatting
    const strongTag = page.locator('strong');
    await expect(strongTag).toBeVisible();
    await expect(strongTag).toContainText('Bold text');
  });

  test('should apply italic formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const italicButton = page.locator('.toolbar button[title="Italic"]');

    // Type some text
    await editor.click();
    await editor.type('Italic text');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Click italic button
    await italicButton.click();

    // Check if button is active
    await expect(italicButton).toHaveClass(/is-active/);

    // Check if text has italic formatting
    const emTag = page.locator('em');
    await expect(emTag).toBeVisible();
    await expect(emTag).toContainText('Italic text');
  });

  test('should apply underline formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const underlineButton = page.locator('.toolbar button[title="Underline"]');

    // Type some text
    await editor.click();
    await editor.type('Underlined text');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Click underline button
    await underlineButton.click();

    // Check if button is active
    await expect(underlineButton).toHaveClass(/is-active/);

    // Check if text has underline formatting
    const uTag = page.locator('u');
    await expect(uTag).toBeVisible();
    await expect(uTag).toContainText('Underlined text');
  });

  test('should toggle formatting on and off', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const boldButton = page.locator('.toolbar button[title="Bold"]');

    // Type some text
    await editor.click();
    await editor.type('Toggle bold');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Apply bold
    await boldButton.click();
    await expect(boldButton).toHaveClass(/is-active/);

    // Toggle off bold
    await boldButton.click();
    await expect(boldButton).not.toHaveClass(/is-active/);
  });

  test('should apply multiple formats simultaneously', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const boldButton = page.locator('.toolbar button[title="Bold"]');
    const italicButton = page.locator('.toolbar button[title="Italic"]');
    const underlineButton = page.locator('.toolbar button[title="Underline"]');

    // Type some text
    await editor.click();
    await editor.type('Multi format');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Apply all formats
    await boldButton.click();
    await italicButton.click();
    await underlineButton.click();

    // All buttons should be active
    await expect(boldButton).toHaveClass(/is-active/);
    await expect(italicButton).toHaveClass(/is-active/);
    await expect(underlineButton).toHaveClass(/is-active/);
  });
});

test.describe('Toolbar - Font Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5178/');
  });

  test('should display font family selector', async ({ page }) => {
    const fontFamilySelect = page.locator('.toolbar select[title="Font Family"]');
    await expect(fontFamilySelect).toBeVisible();

    // Check for some font options
    const options = await fontFamilySelect.locator('option').allTextContents();
    expect(options).toContain('Default');
    expect(options).toContain('Inter');
    expect(options).toContain('Monospace');
  });

  test('should change font family', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const fontFamilySelect = page.locator('.toolbar select[title="Font Family"]');

    // Type some text
    await editor.click();
    await editor.type('Font test');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Change font family to monospace
    await fontFamilySelect.selectOption('monospace');

    // Check if style is applied (TipTap uses span with style attribute)
    const styledSpan = page.locator('span[style*="font-family"]');
    await expect(styledSpan).toBeVisible();
  });

  test('should display font size selector', async ({ page }) => {
    const fontSizeSelect = page.locator('.toolbar select[title="Font Size"]');
    await expect(fontSizeSelect).toBeVisible();

    // Check for heading options
    const options = await fontSizeSelect.locator('option').allTextContents();
    expect(options).toContain('Normal');
    expect(options).toContain('Heading 1');
    expect(options).toContain('Heading 2');
  });

  test('should apply heading 1', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const fontSizeSelect = page.locator('.toolbar select[title="Font Size"]');

    // Type some text
    await editor.click();
    await editor.type('Heading test');

    // Position cursor in the line
    await page.keyboard.press('Home');

    // Change to Heading 1
    await fontSizeSelect.selectOption('1');

    // Check for h1 tag
    const h1Tag = page.locator('h1');
    await expect(h1Tag).toBeVisible();
    await expect(h1Tag).toContainText('Heading test');
  });

  test('should apply heading 2', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const fontSizeSelect = page.locator('.toolbar select[title="Font Size"]');

    // Type some text
    await editor.click();
    await editor.type('Smaller heading');

    // Position cursor in the line
    await page.keyboard.press('Home');

    // Change to Heading 2
    await fontSizeSelect.selectOption('2');

    // Check for h2 tag
    const h2Tag = page.locator('h2');
    await expect(h2Tag).toBeVisible();
    await expect(h2Tag).toContainText('Smaller heading');
  });

  test('should revert heading to normal paragraph', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const fontSizeSelect = page.locator('.toolbar select[title="Font Size"]');

    // Type some text
    await editor.click();
    await editor.type('Normal text');

    // Change to Heading 1
    await page.keyboard.press('Home');
    await fontSizeSelect.selectOption('1');

    // Verify h1 exists
    await expect(page.locator('h1')).toBeVisible();

    // Change back to Normal
    await fontSizeSelect.selectOption('0');

    // Should be a paragraph now
    const pTag = page.locator('p');
    await expect(pTag).toContainText('Normal text');
  });

  test('should maintain formatting across font changes', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const boldButton = page.locator('.toolbar button[title="Bold"]');
    const fontFamilySelect = page.locator('.toolbar select[title="Font Family"]');

    // Type some text
    await editor.click();
    await editor.type('Combined format');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Apply bold
    await boldButton.click();

    // Change font family
    await fontFamilySelect.selectOption('monospace');

    // Bold should still be active
    await expect(boldButton).toHaveClass(/is-active/);

    // Should have both bold and font-family
    const styledText = page.locator('span[style*="font-family"] strong, strong span[style*="font-family"]');
    await expect(styledText.first()).toBeVisible();
  });
});

test.describe('Toolbar - Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5178/');
  });

  test('should apply bold with keyboard shortcut', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const boldButton = page.locator('.toolbar button[title="Bold"]');

    // Type some text
    await editor.click();
    await editor.type('Keyboard bold');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Apply bold with Cmd+B
    await page.keyboard.press('Meta+B');

    // Button should be active
    await expect(boldButton).toHaveClass(/is-active/);

    // Text should be bold
    const strongTag = page.locator('strong');
    await expect(strongTag).toContainText('Keyboard bold');
  });

  test('should apply italic with keyboard shortcut', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const italicButton = page.locator('.toolbar button[title="Italic"]');

    // Type some text
    await editor.click();
    await editor.type('Keyboard italic');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Apply italic with Cmd+I
    await page.keyboard.press('Meta+I');

    // Button should be active
    await expect(italicButton).toHaveClass(/is-active/);

    // Text should be italic
    const emTag = page.locator('em');
    await expect(emTag).toContainText('Keyboard italic');
  });

  test('should apply underline with keyboard shortcut', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first();
    const underlineButton = page.locator('.toolbar button[title="Underline"]');

    // Type some text
    await editor.click();
    await editor.type('Keyboard underline');

    // Select all text
    await page.keyboard.press('Meta+A');

    // Apply underline with Cmd+U
    await page.keyboard.press('Meta+U');

    // Button should be active
    await expect(underlineButton).toHaveClass(/is-active/);

    // Text should be underlined
    const uTag = page.locator('u');
    await expect(uTag).toContainText('Keyboard underline');
  });
});
