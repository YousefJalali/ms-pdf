import { expect, test } from '@playwright/test'

test.describe('upload pdf', () => {
	let fileName = 'one_page.pdf'

	test.beforeEach(async ({ page }) => {
		await page.goto('/merge')

		//upload pdf
		await page.getByTestId('upload doc').setInputFiles(`./tests/${fileName}`)
	})

	test('doc name to be in the side list', async ({ page }) => {
		await expect(page.getByTestId('doc list')).toBeVisible()
		await expect(page.getByTestId('doc list')).toContainText(fileName)
	})

	test('doc name to be in the drop zone', async ({ page }) => {
		await expect(page.getByTestId('drop zone')).toBeVisible()
		await expect(page.getByTestId('drop zone')).toContainText(fileName)
	})
})

test.describe('one page doc', () => {
	let onePage = 'one_page.pdf'

	test.beforeEach(async ({ page }) => {
		await page.goto('/merge')

		//upload pdf
		await page.getByTestId('upload doc').setInputFiles(`./tests/${onePage}`)
	})

	test('page stack to be hidden', async ({ page }) => {
		await expect(page.getByTestId('page stack')).toBeHidden()
	})

	test('doc name to be in the side list', async ({ page }) => {
		await expect(page.getByTestId('doc list')).toBeVisible()
		await expect(page.getByTestId('doc list')).toContainText(onePage)
		await expect(page.getByTestId('doc list')).toContainText('1 page')
	})

	test('doc name to be in the drop zone', async ({ page }) => {
		await expect(page.getByTestId('drop zone')).toBeVisible()
		await expect(page.getByTestId('drop zone')).toContainText(onePage)
		await expect(page.getByTestId('drop zone')).toContainText('Page 1')
	})
})

test('page action should be visible on hover', async ({ page }) => {
	let twoPages = 'two_pages.pdf'
	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

	await page.locator('[data-testid="drop zone"]>div').first().hover()

	await expect(page.getByTestId('drop zone').getByRole('button').first()).toBeVisible()
})

test(
	'modal should open when click on zoom and close when click on x',
	{
		tag: '@Preview'
	},
	async ({ page }) => {
		let twoPages = 'two_pages.pdf'
		await page.goto('/merge')
		//upload pdf
		await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

		//hover over doc
		await page.locator('[data-testid="drop zone"]>div').first().hover()

		//click on zoom button
		await page.locator('[data-testid="drop zone"]>div').first().getByRole('button').first().click()

		//modal should open to show preview
		await expect(page.getByAltText(`preview page 1 of ${twoPages}`)).toBeVisible()
		// await expect(page.getByAltText(`preview page 2 of ${twoPages}`)).toBeVisible()

		//close modal
		await page.getByRole('button', { name: '✕' }).click()

		//should be removed from DOM
		await expect(page.getByAltText(`preview page 1 of ${twoPages}`)).toBeHidden()
	}
)

test('show & hide pages', async ({ page }) => {
	let twoPages = 'two_pages.pdf'
	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

	//second page should be hidden
	await expect(page.locator('[data-testid="drop zone"]>div').nth(1)).toBeHidden()

	//click on more button
	await page.getByTestId('doc list').first().getByRole('button').click()

	//dropdown should be visible
	await expect(page.locator('[data-testid="doc list"] .dropdown-content')).toBeVisible()

	//show pages
	await page.locator('[data-testid="doc list"] .dropdown-content').getByLabel('Show Pages').check()

	//second page should be visible
	await expect(page.locator('[data-testid="drop zone"]>div').nth(1)).toBeVisible()

	//hide pages
	await page
		.locator('[data-testid="doc list"] .dropdown-content')
		.getByLabel('Show Pages')
		.uncheck()

	//second page should be hidden
	await expect(page.locator('[data-testid="drop zone"]>div').nth(1)).toBeHidden()
})
