import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('user can login and logout', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button:has-text("Войти")')

    // После входа админ редиректится на /admin/users
    await expect(page).toHaveURL('/admin/users')
    await expect(page.locator('text=Админка')).toBeVisible()

    // Выход
    await page.click('text=Выйти')
    await expect(page).toHaveURL('/login')
  })

  test('invalid credentials show error', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'bad@example.com')
    await page.fill('input[type="password"]', 'wrong')
    await page.click('button:has-text("Войти")')

    await expect(page.locator('text=Ошибка входа')).toBeVisible()
  })

  test('guest cannot access protected routes', async ({ page }) => {
    await page.goto('/my-decks')
    await expect(page).toHaveURL('/login')
  })

  test('user cannot access admin routes', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'user@example.com')
    await page.fill('input[type="password"]', 'user123')
    await page.click('button:has-text("Войти")')

    await page.goto('/admin/users')
    await expect(page).toHaveURL('/')
  })
})
