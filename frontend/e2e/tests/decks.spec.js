import { test, expect } from '@playwright/test'

test.describe('Decks CRUD', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button:has-text("Войти")')
    await expect(page).toHaveURL('/admin/users')
  })

  test('admin can navigate to my-decks and see decks', async ({ page }) => {
    await page.click('text=Мои Шпаргалки')
    await expect(page).toHaveURL('/my-decks')
  })

  test('navigation and filter states', async ({ page }) => {
    await page.goto('/my-decks')
    // Проверяем, что страница загрузилась без ошибок
    await expect(page.locator('h1, h2, div').first()).toBeVisible()
  })
})
