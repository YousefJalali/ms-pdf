import { expect, test } from '@playwright/test'

test.describe('upload pdf', () => {
	let fileName = 'one_page.pdf'

	test.beforeEach(async ({ page }) => {
		await page.goto('/merge')

		//upload pdf
		await page.getByTestId('upload doc').setInputFiles(`./tests/${fileName}`)
	})

	test('doc name to be in the side list', async ({ page }) => {
		await expect(page.locator('[data-testid="side"]>[data-testid="doc list"]')).toBeVisible()
		await expect(page.locator('[data-testid="side"]>[data-testid="doc list"]')).toContainText(
			fileName
		)
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
		await expect(page.locator('[data-testid="side"]>[data-testid="doc list"]')).toBeVisible()
		await expect(page.locator('[data-testid="side"]>[data-testid="doc list"]')).toContainText(
			onePage
		)
		await expect(page.locator('[data-testid="side"]>[data-testid="doc list"]')).toContainText(
			'1 page'
		)
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

test('modal should open when click on zoom and close when click on x', async ({ page }) => {
	let twoPages = 'two_pages.pdf'
	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

	//hover over doc
	await page.locator('[data-testid="drop zone"]>div').first().hover()

	//click on zoom button
	await page
		.locator('[data-testid="card-options-desktop"]')
		.first()
		.getByRole('button', { name: 'preview' })
		.click()

	//modal should open to show preview
	await expect(page.getByAltText(`preview page 1 of ${twoPages}`)).toBeVisible()
	// await expect(page.getByAltText(`preview page 2 of ${twoPages}`)).toBeVisible()

	//close modal
	await page.getByRole('button', { name: '✕' }).click()

	//should be removed from DOM
	await expect(page.getByAltText(`preview page 1 of ${twoPages}`)).toBeHidden()
})

test('show & hide pages', async ({ page }) => {
	let twoPages = 'two_pages.pdf'
	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

	//second page should be hidden
	await expect(page.locator('[data-testid="drop zone"]>div').nth(1)).toBeHidden()

	//click on more button
	await page
		.locator('[data-testid="side"]>[data-testid="doc list"]')
		.first()
		.getByLabel('doc-options')
		.click()

	//dropdown should be visible
	await expect(
		page.locator('[data-testid="side"]>[data-testid="doc list"] .dropdown-content')
	).toBeVisible()

	//show pages
	await page
		.locator('[data-testid="side"]>[data-testid="doc list"] .dropdown-content')
		.getByLabel('Show Pages')
		.check()

	//second page should be visible
	await expect(page.locator('[data-testid="drop zone"]>div').nth(1)).toBeVisible()

	//hide pages
	await page
		.locator('[data-testid="side"]>[data-testid="doc list"] .dropdown-content')
		.getByLabel('Show Pages')
		.uncheck()

	//second page should be hidden
	await expect(page.locator('[data-testid="drop zone"]>div').nth(1)).toBeHidden()
})

test('Delete one document', async ({ page }) => {
	const onePage = 'one_page.pdf'
	const twoPages = 'two_pages.pdf'

	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${onePage}`)
	await page.getByTestId('side').getByText('Add Files').setInputFiles(`./tests/${twoPages}`)

	//3 pages should be uploaded (2 visible and one hidden)
	await expect(page.locator('[data-testid="drop zone"]>div')).toHaveCount(3)

	//hover over doc
	await page.locator('[data-testid="drop zone"]>div').first().hover()

	//click on zoom button
	await page
		.locator('[data-testid="card-options-desktop"]')
		.first()
		.getByRole('button', { name: 'delete' })
		.click()

	//one page doc should be deleted
	await expect(page.locator('[data-testid="drop zone"]>div')).toHaveCount(2)
})

test('Delete all documents', async ({ page }) => {
	const onePage = 'one_page.pdf'
	const twoPages = 'two_pages.pdf'

	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${onePage}`)
	await page.getByTestId('side').getByText('Add Files').setInputFiles(`./tests/${twoPages}`)

	//3 pages should be uploaded (2 visible and one hidden)
	await expect(page.locator('[data-testid="drop zone"]>div')).toHaveCount(3)

	//hover over doc
	await page.locator('[data-testid="drop zone"]>div').first().hover()

	//click on zoom button
	await page
		.locator('[data-testid="card-options-desktop"]')
		.first()
		.getByRole('button', { name: 'delete' })
		.click()

	//one page doc should be deleted
	await expect(page.locator('[data-testid="drop zone"]>div')).toHaveCount(2)

	//hover over doc
	await page.locator('[data-testid="drop zone"]>div').first().hover()

	//click on zoom button
	await page
		.locator('[data-testid="card-options-desktop"]')
		.first()
		.getByRole('button', { name: 'delete' })
		.click()

	//drop zone should be hidden
	await expect(page.locator('[data-testid="drop zone"]')).toBeHidden()
})

test('Rotate doc', async ({ page }) => {
	const twoPages = 'two_pages.pdf'

	await page.goto('/merge')

	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

	//hover over doc
	await page.locator('[data-testid="drop zone"]>div').first().hover()

	//no rotation CSS
	await expect(
		page.locator('[data-testid="drop zone"]').getByRole('img', { name: twoPages })
	).not.toHaveCSS('transform', 'matrix(0, 0.8, -0.8, 0, 0, 0)')

	//click on zoom button
	await page
		.locator('[data-testid="card-options-desktop"]')
		.first()
		.getByRole('button', { name: 'rotate' })
		.click()

	//image should be rotated -> transform: rotate(90deg) scale(0.8)
	await expect(
		page.locator('[data-testid="drop zone"]').getByRole('img', { name: twoPages })
	).toHaveCSS('transform', 'matrix(0, 0.8, -0.8, 0, 0, 0)')
})

test('drag and drop', async ({ page }) => {
	let twoPages = 'two_pages.pdf'
	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${twoPages}`)

	//click on more button
	await page
		.locator('[data-testid="side"]>[data-testid="doc list"]')
		.first()
		.getByLabel('doc-options')
		.click()

	//show pages
	await page
		.locator('[data-testid="side"]>[data-testid="doc list"] .dropdown-content')
		.getByLabel('Show Pages')
		.check()

	//first page (index 0) should be the first page
	await expect(page.locator('[data-testid="thumbnail"]').getByRole('img').first()).toHaveAttribute(
		'alt',
		`${twoPages} 0`
	)

	//drag
	await page
		.getByTestId('drop zone')
		.locator('div')
		.filter({ hasText: `${twoPages} Page 1` })
		.nth(1)
		.hover()
	await page.mouse.down()

	await page
		.getByTestId('drop zone')
		.locator('div')
		.filter({ hasText: `${twoPages} Page 2` })
		.nth(1)
		.hover()
	await page
		.getByTestId('drop zone')
		.locator('div')
		.filter({ hasText: `${twoPages} Page 2` })
		.nth(1)
		.hover()
	await page
		.getByTestId('drop zone')
		.locator('div')
		.filter({ hasText: `${twoPages} Page 2` })
		.nth(1)
		.hover()

	await page.mouse.up()

	//second page (index 1) should be the first page & first page (index 0) should be second
	await expect(page.locator('[data-testid="thumbnail"]').getByRole('img').first()).toHaveAttribute(
		'alt',
		`${twoPages} 1`
	)
	await expect(page.locator('[data-testid="thumbnail"]').getByRole('img').nth(1)).toHaveAttribute(
		'alt',
		`${twoPages} 0`
	)
})

test('Merge two docs', async ({ page }) => {
	const onePage = 'one_page.pdf'
	const twoPages = 'two_pages.pdf'

	await page.goto('/merge')
	//upload pdf
	await page.getByTestId('upload doc').setInputFiles(`./tests/${onePage}`)
	await page.getByTestId('side').getByText('Add Files').setInputFiles(`./tests/${twoPages}`)

	//click on merge button
	await page.getByRole('button', { name: 'merge' }).click()

	//preview box should be visible
	await expect(page.getByTestId('preview merged')).toBeVisible()

	//doc pages should be displayed in order
	await expect(
		page.getByTestId('preview merged').locator('div').first().getByRole('img')
	).toHaveAttribute('alt', `${onePage} 0`)
	await expect(
		page.getByTestId('preview merged').locator('div').nth(1).getByRole('img')
	).toHaveAttribute('alt', `${twoPages} 0`)
	await expect(
		page.getByTestId('preview merged').locator('div').nth(2).getByRole('img')
	).toHaveAttribute('alt', `${twoPages} 1`)
})
