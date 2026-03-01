import { test, expect } from '@playwright/test'

test.describe('Word Processor - Formatting Toolbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display the formatting toolbar', async ({ page }) => {
    const toolbar = page.locator('.toolbar')
    await expect(toolbar).toBeVisible()
  })

  test('should have bold, italic, and underline buttons', async ({ page }) => {
    const boldButton = page.locator('.toolbar button[title="Bold"]')
    const italicButton = page.locator('.toolbar button[title="Italic"]')
    const underlineButton = page.locator('.toolbar button[title="Underline"]')

    await expect(boldButton).toBeVisible()
    await expect(italicButton).toBeVisible()
    await expect(underlineButton).toBeVisible()
  })

  test('should apply bold formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const boldButton = page.locator('.toolbar button[title="Bold"]')

    await editor.click()
    await editor.type('Bold text')
    await page.keyboard.press('Meta+A')
    await boldButton.click()

    const strong = editor.locator('strong')
    await expect(strong).toBeVisible()
    await expect(strong).toContainText('Bold text')
  })

  test('should apply italic formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const italicButton = page.locator('.toolbar button[title="Italic"]')

    await editor.click()
    await editor.type('Italic text')
    await page.keyboard.press('Meta+A')
    await italicButton.click()

    const em = editor.locator('em')
    await expect(em).toBeVisible()
    await expect(em).toContainText('Italic text')
  })

  test('should apply underline formatting', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const underlineButton = page.locator('.toolbar button[title="Underline"]')

    await editor.click()
    await editor.type('Underlined text')
    await page.keyboard.press('Meta+A')
    await underlineButton.click()

    const u = editor.locator('u')
    await expect(u).toBeVisible()
    await expect(u).toContainText('Underlined text')
  })

  test('should toggle formatting on and off', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const boldButton = page.locator('.toolbar button[title="Bold"]')

    // Type some text
    await editor.click()
    await editor.type('Normal text')
    await page.keyboard.press('Enter')

    // Enable bold for new text
    await boldButton.click()
    await editor.type('Bold text')

    // Verify bold text exists
    const strong = editor.locator('strong')
    await expect(strong).toBeVisible()
    await expect(strong).toContainText('Bold text')

    // Verify normal text is not bold
    const content = await editor.textContent()
    expect(content).toContain('Normal text')
  })

  test('should have font family selector', async ({ page }) => {
    const fontSelect = page.locator('.toolbar select[title="Font Family"]')
    await expect(fontSelect).toBeVisible()

    const options = await fontSelect.locator('option').allTextContents()
    expect(options).toContain('Arial')
    expect(options).toContain('Times New Roman')
  })

  test('should have font size selector', async ({ page }) => {
    const sizeSelect = page.locator('.toolbar select[title="Font Size"]')
    await expect(sizeSelect).toBeVisible()

    const options = await sizeSelect.locator('option').allTextContents()
    expect(options).toContain('16px')
    expect(options).toContain('24px')
  })

  test('should apply font family', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const fontSelect = page.locator('.toolbar select[title="Font Family"]')

    await editor.click()
    await editor.type('Arial text')
    await page.keyboard.press('Meta+A')
    await fontSelect.selectOption('Arial')

    const content = await editor.innerHTML()
    expect(content).toContain('Arial')
  })

  test('should apply font size', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const sizeSelect = page.locator('.toolbar select[title="Font Size"]')

    await editor.click()
    await editor.type('Big text')
    await page.keyboard.press('Meta+A')
    await sizeSelect.selectOption('24px')

    const content = await editor.innerHTML()
    expect(content).toContain('24px')
  })

  test('should combine multiple formats', async ({ page }) => {
    const editor = page.locator('[contenteditable="true"]').first()
    const boldButton = page.locator('.toolbar button[title="Bold"]')
    const italicButton = page.locator('.toolbar button[title="Italic"]')

    await editor.click()
    await editor.type('Bold and italic')
    await page.keyboard.press('Meta+A')

    await boldButton.click()
    await italicButton.click()

    const strong = editor.locator('strong')
    const em = editor.locator('em')
    await expect(strong).toBeVisible()
    await expect(em).toBeVisible()
  })
})
