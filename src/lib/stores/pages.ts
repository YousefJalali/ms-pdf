import { get, writable } from 'svelte/store'
import type { PDFPage, Page } from '$lib/types'
import { docs } from './docs'
import { thumbnails } from './images'

function handlePages() {
	const { subscribe, set, update } = writable<Page[]>([])

	function create(newPage: Omit<Page, 'id' | 'rotationDegree'>) {
		update((pages) => [...pages, { ...newPage, id: newPage.pageId, rotationDegree: undefined }])
	}

	function showDocPages(docId: string) {
		let docPages: { [pageId: string]: PDFPage } = {}
		let allDocs = get(docs)

		update((pages) =>
			pages.map((page) => {
				if (page.docId === docId) {
					docPages[page.pageId] = allDocs[page.docId].pagesPdfProxy[page.pageId]
					let updatedPage: Page = { ...page, isVisible: true }
					return updatedPage
				}
				return page
			})
		)

		//create thumbnail if its not created
		thumbnails.create(docPages, docId)
	}

	function hideDocPages(docId: string) {
		let p = get(pages)
		let firstIdx = 0
		let lastIdx = 1

		while (lastIdx < p.length) {
			if (p[firstIdx].docId === docId && p[firstIdx].docId === p[lastIdx].docId) {
				lastIdx++
			} else {
				for (let j = firstIdx + 1; j < lastIdx; j++) {
					p[j].isVisible = false
				}

				firstIdx = lastIdx
				lastIdx++
			}
		}
		for (let j = firstIdx + 1; j < lastIdx; j++) {
			p[j].isVisible = false
		}

		pages.set(p)
	}

	function deleteDocPages(docId: string) {
		update((pages) => pages.filter((page) => page.docId !== docId))
	}

	function deletePage(pageId: string, onePageOnly = false) {
		let allPages = [...get(pages)]

		let pageIndex = allPages.findIndex((page) => page.pageId === pageId)

		let docId = allPages[pageIndex].docId

		let count = 1
		const idsOfPagesToBeDeleted = [pageId]

		//include next invisible pages
		if (!onePageOnly) {
			for (let i = pageIndex + 1; i < allPages.length; i++) {
				if (!allPages[i].isVisible) {
					count++
					idsOfPagesToBeDeleted.push(allPages[i].pageId)
				} else {
					break
				}
			}
		}

		allPages.splice(pageIndex, count)

		set(allPages)

		docs.decreasePageCount(docId, count)
		thumbnails.deletePage(idsOfPagesToBeDeleted)
	}

	function rotate(pageId: string, degree: number) {
		const allPages = [...get(pages)]

		let found = false
		for (let page of allPages) {
			if (found) {
				if (!page.isVisible) {
					page.rotationDegree =
						page.rotationDegree === 270 ? 0 : (page.rotationDegree || 0) + degree
				} else {
					break
				}
			}

			if (page.pageId === pageId) {
				page.rotationDegree = page.rotationDegree === 270 ? 0 : (page.rotationDegree || 0) + degree
				found = true
			}
		}

		set(allPages)
	}

	async function loadThumbnail(pageId: string) {
		update((pages) =>
			pages.map((page) => (page.pageId === pageId ? { ...page, loadThumbnail: true } : page))
		)
	}

	function loadPreview(pageId: string) {
		update((pages) =>
			pages.map((page) => (page.pageId === pageId ? { ...page, loadPreview: true } : page))
		)
	}

	function reset() {
		set([])
	}

	return {
		subscribe,
		set,
		create,
		showDocPages,
		hideDocPages,
		deleteDocPages,
		deletePage,
		rotate,
		reset
	}
}

export const pages = handlePages()
