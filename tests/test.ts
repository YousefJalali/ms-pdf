import { translations } from '$lib/constants/translations'
import { generateFileName } from '$lib/custom-utils'
import { expect, test, type Locator } from '@playwright/test'

test.describe('split', () => {
	let firstDoc = 'one_page.pdf'
	let secondDoc = 'two_pages.pdf'

	let side: Locator
	let dropZone: Locator
	let pageStack: Locator
	let cards: Locator
	let cardsPreview: Locator
	let cardsRotate: Locator
	let cardsDelete: Locator

	test.beforeEach(async ({ page }) => {
		await page.goto('/split')
		await page
			.getByTestId('upload doc')
			.setInputFiles([`./tests/${firstDoc}`, `./tests/${secondDoc}`])

		side = page.locator('[data-testid="side"]')
		dropZone = page.getByTestId('drop zone')
		pageStack = page.getByTestId('page stack')
		cards = page.locator('[data-testid="drop zone"]>div')
		cardsPreview = page.getByTestId('card-preview')
		cardsRotate = page.getByTestId('card-rotate')
		cardsDelete = page.getByTestId('card-delete')
	})

	test('split tabs functionality', async ({ page }) => {
		await expect(side).toBeVisible()
		await expect(side.getByTestId('split-tabs')).toBeVisible()

		//split by range tab
		await side.getByTestId('split-tabs').getByText('Range').click()
		await expect(side.getByPlaceholder('e.g. 1-5, 8')).toBeVisible()

		//split all pages tab
		await side.getByTestId('split-tabs').getByText('all').click()
		await expect(side.getByText(translations['en']['split.all.desc'])).toBeVisible()
		await expect(side.getByPlaceholder('e.g. 1-5, 8')).toBeHidden()
	})

	test('range should be added when doc is uploaded', async ({ page }) => {
		await expect(side.getByTestId('split-ranges')).toBeVisible()

		await expect(side.getByTestId('split-ranges').getByText('1 - 1 (1 Page)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('2 - 3 (2 Pages)')).toBeVisible()
	})

	test('merge deleted range with the previous one', async ({ page }) => {
		await expect(side.getByTestId('split-ranges')).toBeVisible()

		await expect(side.getByTestId('split-ranges').getByText('1 - 1 (1 Page)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('2 - 3 (2 Pages)')).toBeVisible()

		await side.getByTestId('split-ranges').getByRole('button').nth(1).click()

		await expect(side.getByTestId('split-ranges').getByRole('button')).toHaveCount(1)
		await expect(side.getByTestId('split-ranges').getByText('2 - 3 (2 Pages)')).toBeHidden()

		await expect(side.getByTestId('split-ranges').getByText('1 - 3 (3 Pages)')).toBeVisible()
	})

	test('add/delete range', async ({ page }) => {
		await expect(side.getByTestId('split-ranges')).toBeVisible()

		await expect(side.getByTestId('split-ranges').getByRole('button')).toHaveCount(2)
		await expect(side.getByTestId('split-ranges').getByText('1 - 1 (1 Page)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('2 - 3 (2 Pages)')).toBeVisible()

		await side.getByPlaceholder('e.g. 1-5, 8').fill('2 - 2')

		await side.getByPlaceholder('e.g. 1-5, 8').press('Enter')
		await expect(side.getByTestId('split-ranges').getByRole('button')).toHaveCount(3)
		await expect(side.getByTestId('split-ranges').getByText('1 - 1 (1 Page)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('2 - 2 (1 Page)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('3 - 3 (1 Page)')).toBeVisible()

		//delete middle range
		await side.getByTestId('split-ranges').getByRole('button').nth(0).click()
		await expect(side.getByTestId('split-ranges').getByRole('button')).toHaveCount(2)
		await expect(side.getByTestId('split-ranges').getByText('1 - 2 (2 Pages)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('3 - 3 (1 Page)')).toBeVisible()
	})

	test('if there is only one range, it cant be deleted', async ({ page }) => {
		await expect(side.getByTestId('split-ranges')).toBeVisible()

		await expect(side.getByTestId('split-ranges').getByRole('button')).toHaveCount(2)
		await expect(side.getByTestId('split-ranges').getByText('1 - 1 (1 Page)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByText('2 - 3 (2 Pages)')).toBeVisible()

		await side.getByTestId('split-ranges').getByRole('button').nth(0).click()
		await expect(side.getByTestId('split-ranges').getByRole('button')).toHaveCount(1)
		await expect(side.getByTestId('split-ranges').getByText('1 - 3 (3 Pages)')).toBeVisible()
		await expect(side.getByTestId('split-ranges').getByRole('button').nth(0)).toBeDisabled()
	})

	test('download splitted docs', async ({ page }) => {
		//click on merge button
		await page.getByRole('button', { name: 'download (2 PDFs)' }).click()

		// Start waiting for download before clicking. Note no await.
		const downloadPromise = page.waitForEvent('download')
		await page.getByRole('button', { name: 'Download' }).click()
		const download = await downloadPromise

		expect(download.suggestedFilename()).toEqual(`${generateFileName('Split')}.zip`)

		// Wait for the download process to complete and save the downloaded file somewhere.
		// await download.saveAs('./tests/' + download.suggestedFilename())
	})
})

test.describe('merge', () => {
	let firstDoc = 'one_page.pdf'
	let secondDoc = 'two_pages.pdf'

	let docList: Locator
	let dropZone: Locator
	let pageStack: Locator
	let cards: Locator
	let cardsPreview: Locator
	let cardsRotate: Locator
	let cardsDelete: Locator

	test.beforeEach(async ({ page }) => {
		await page.goto('/merge')
		await page
			.getByTestId('upload doc')
			.setInputFiles([`./tests/${firstDoc}`, `./tests/${secondDoc}`])

		docList = page.locator('[data-testid="side"] [data-testid="doc list"]>li')
		dropZone = page.getByTestId('drop zone')
		pageStack = page.getByTestId('page stack')
		cards = page.locator('[data-testid="drop zone"]>div')
		cardsPreview = page.getByTestId('card-preview')
		cardsRotate = page.getByTestId('card-rotate')
		cardsDelete = page.getByTestId('card-delete')
	})

	test('doc name should be in the side list after upload', async ({ page }) => {
		await expect(docList).toHaveCount(2)
		await expect(docList.first()).toContainText(firstDoc)
		await expect(docList.nth(1)).toContainText(secondDoc)
	})

	test('doc name should be in the drop zone after upload', async ({ page }) => {
		await expect(dropZone).toBeVisible()
		await expect(dropZone).toContainText(firstDoc)
		await expect(dropZone).toContainText(secondDoc)
	})

	// test('page stack should be hidden for one page doc', async ({ page }) => {
	// 	await expect(pageStack.first()).toBeHidden()
	// 	await expect(pageStack.nth(1)).toBeVisible()
	// })

	test('first page options should be visible on hover', async ({ page }) => {
		await cards.first().hover()
		await expect(cardsPreview.first()).toBeVisible()
	})

	test('modal should open when click on zoom and close when click on x', async ({ page }) => {
		//hover over doc
		await cards.first().hover()

		//click on zoom button
		await cardsPreview.first().click()

		//spinner
		await expect(page.getByTestId('preview-loading')).toHaveCount(0)

		//modal should open to show preview
		await expect(page.getByAltText(`preview page 1 of ${firstDoc}`)).toBeVisible()

		//close modal
		await page.locator('button[data-dialog-close]').click()

		//should be removed from DOM
		await expect(page.getByAltText(`preview page 1 of ${firstDoc}`)).toBeHidden()
	})

	test('show & hide pages from doc list', async ({ page }) => {
		const dropdown = page.getByTestId('doc-options-dropdown')

		//third page should be hidden
		await expect(cards.nth(2)).toBeHidden()

		//click on more button
		await docList.nth(1).getByLabel('doc-options-btn').click()

		//dropdown should be visible
		await expect(dropdown).toBeVisible()

		//show pages
		await dropdown.getByLabel('Show Pages').check()

		//third page should be visible
		await expect(cards.nth(2)).toBeVisible()

		//click on more button
		await docList.nth(1).getByLabel('doc-options-btn').click()

		//hide pages
		await dropdown.getByLabel('Show Pages').uncheck()

		//third page should be hidden
		await expect(cards.nth(2)).toBeHidden()
	})

	test('Delete one page', async ({ page }) => {
		//3 pages should be uploaded (2 visible and one hidden)
		await expect(cards).toHaveCount(3)

		//hover over doc
		await cards.first().hover()

		//click on zoom button
		await page
			.locator('[data-testid="card-options-desktop"]')
			.first()
			.getByRole('button', { name: 'delete' })
			.click()

		//one page doc should be deleted
		await expect(cards).toHaveCount(2)
	})

	test('Delete page and hidden pages of document', async ({ page }) => {
		//3 pages should be uploaded (2 visible and one hidden)
		await expect(cards).toHaveCount(3)

		//hover over doc
		await cards.nth(1).hover()

		//click on zoom button
		await cardsDelete.nth(1).click()

		//one page doc should be deleted
		await expect(cards).toHaveCount(1)
	})

	test('Delete doc from doc list', async ({ page }) => {
		//3 pages should be uploaded (2 visible and one hidden)
		await expect(cards).toHaveCount(3)

		//delete second doc (2 pages)
		await docList.nth(1).getByLabel('doc-options-btn').click()
		await page.getByTestId('doc-options-dropdown').getByLabel('delete document').click()

		await expect(cards).toHaveCount(1)
	})

	test('Rotate page', async ({ page }) => {
		//no rotation CSS
		await expect(cards.first().getByRole('img', { name: firstDoc })).not.toHaveCSS(
			'transform',
			'matrix(0, 0.8, -0.8, 0, 0, 0)'
		)

		//hover over doc
		await cards.first().hover()

		//click on zoom button
		await cardsRotate.first().click()

		//image should be rotated -> transform: rotate(90deg) scale(0.8)
		await expect(cards.first().getByRole('img', { name: firstDoc })).toHaveCSS(
			'transform',
			'matrix(0, 1, -1, 0, 0, 0)'
		)

		//hover over doc
		await cards.first().hover()

		//click on zoom button
		await cardsRotate.first().click()
		// await page
		// 	.locator('[data-testid="card-options-desktop"]')
		// 	.first()
		// 	.getByRole('button', { name: 'rotate' })
		// 	.click()

		//image should be rotated -> transform: rotate(180deg) scale(1)
		await expect(cards.first().getByRole('img', { name: firstDoc })).toHaveCSS(
			'transform',
			'matrix(-0.8, 0, 0, -0.8, 0, 0)'
		)
	})

	test('drag and drop', async ({ page }) => {
		await expect(cards).toHaveCount(3)

		//first doc (1 page) should be at index 0
		await expect(cards.first().getByTestId('thumbnail').getByRole('img')).toHaveAttribute(
			'alt',
			`${firstDoc} 0`
		)

		//drag
		await cards.first().hover()

		await page.mouse.down()

		await cards.nth(1).hover()
		await cards.nth(1).hover()
		await cards.nth(1).hover()

		await page.mouse.up()

		//second doc (2 pages: index 0 and index: 1) should be the first & the first doc should be at index 2
		await expect(cards.first().getByTestId('thumbnail').getByRole('img')).toHaveAttribute(
			'alt',
			`${secondDoc} 0`
		)
		await expect(cards.nth(2).getByTestId('thumbnail').getByRole('img')).toHaveAttribute(
			'alt',
			`${firstDoc} 0`
		)
	})

	test('Merge two docs', async ({ page }) => {
		//click on merge button
		await page.getByRole('button', { name: 'merge' }).click()

		//preview box should be visible
		await expect(page.getByTestId('preview merged')).toBeVisible()

		//doc pages should be displayed in order
		await expect(
			page.getByTestId('preview merged').locator('div').first().getByRole('img')
		).toHaveAttribute('alt', `${firstDoc} 0`)
		await expect(
			page.getByTestId('preview merged').locator('div').nth(1).getByRole('img')
		).toHaveAttribute('alt', `${secondDoc} 0`)
		await expect(
			page.getByTestId('preview merged').locator('div').nth(2).getByRole('img')
		).toHaveAttribute('alt', `${secondDoc} 1`)
	})

	test('back to editing after merge', async ({ page }) => {
		//click on merge button
		await page.getByRole('button', { name: 'merge' }).click()

		//preview box should be visible
		await expect(page.getByTestId('preview merged')).toBeVisible()
		await expect(dropZone).toBeHidden()

		await page.getByRole('button', { name: 'Back to Editing' }).click()

		//preview box should be visible
		await expect(page.getByTestId('preview merged')).toBeHidden()
		await expect(dropZone).toBeVisible()
		await expect(cards).toHaveCount(3)
	})

	test('download merged doc', async ({ page }) => {
		//click on merge button
		await page.getByRole('button', { name: 'merge' }).click()

		// Start waiting for download before clicking. Note no await.
		const downloadPromise = page.waitForEvent('download')
		await page.getByRole('button', { name: 'Download' }).click()
		const download = await downloadPromise

		expect(download.suggestedFilename()).toEqual('merged-pdf.pdf')

		// Wait for the download process to complete and save the downloaded file somewhere.
		// await download.saveAs('./tests/' + download.suggestedFilename())
	})
})
