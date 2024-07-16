import { expect, test, type FileChooser } from '@playwright/test'
import path from 'path'

const __dirname = path.resolve()

test('home page has expected h1', async ({ page }) => {
	await page.goto('/')
	await expect(page.locator('h1')).toBeVisible()
})
// await page.goto('http://localhost:5173/merge')
// await page.locator('label').click()
// await page.locator('body').setInputFiles('merged-pdf (2)-merged.pdf')

test('upload pdf', async ({ page }) => {
	test.use({ headless: false })
	const p = path.join(__dirname, 'sample.pdf')

	console.log(p)

	await page.goto('/merge')

	await page.getByTestId('upload doc').setInputFiles('sample.pdf')
})
