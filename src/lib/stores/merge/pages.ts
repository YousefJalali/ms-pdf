import { get, writable } from 'svelte/store'
import type { Page } from '$lib/types/merge'
import { docs } from './docs'

function handlePages() {
	const { subscribe, set, update } = writable<Page[]>([])

	type NewPage = Omit<Page, 'id' | 'loadPreview' | 'rotationDegree'>
	function add({ pageId, docId, pageNum, pageVisible, loadThumbnail, initialRotation }: NewPage) {
		let newPage: Page = {
			id: pageId,
			pageId,
			docId,
			pageNum,
			pageVisible,
			loadPreview: false,
			loadThumbnail,
			initialRotation,
			rotationDegree: undefined
		}
		update((pages) => [...pages, newPage])
	}

	function rotate(pageId: string, degree: number) {
		const allPages = [...get(pages)]

		let found = false
		for (let page of allPages) {
			if (found) {
				if (!page.pageVisible) {
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

	async function showPages(docId: string) {
		const doc = get(docs)[docId]

		if (doc.pageCount <= 1) return

		update((pages) =>
			pages.map((page) =>
				page.docId === docId ? { ...page, pageVisible: true, loadThumbnail: true } : page
			)
		)
	}

	async function hidePages(docId: string) {
		const doc = get(docs)[docId]
		if (doc.pageCount <= 1) return

		let p = get(pages)
		let firstIdx = 0
		let lastIdx = 1

		while (lastIdx < p.length) {
			if (p[firstIdx].docId === docId && p[firstIdx].docId === p[lastIdx].docId) {
				lastIdx++
			} else {
				for (let j = firstIdx + 1; j < lastIdx; j++) {
					p[j].pageVisible = false
				}

				firstIdx = lastIdx
				lastIdx++
			}
		}
		for (let j = firstIdx + 1; j < lastIdx; j++) {
			p[j].pageVisible = false
		}

		pages.set(p)
	}

	function removePage(pageId: string, onePageOnly = false) {
		let curPages = [...get(pages)]

		let pageIndex = curPages.findIndex((page) => page.pageId === pageId)

		let docId = curPages[pageIndex].docId

		let count = 1

		//include next invisible pages
		if (!onePageOnly) {
			for (let i = pageIndex + 1; i < curPages.length; i++) {
				if (!curPages[i].pageVisible) {
					count++
				} else {
					break
				}
			}
		}

		curPages.splice(pageIndex, count)

		set(curPages)

		docs.decreasePageCount(docId, count)
	}

	function removeDocPages(docId: string) {
		update((pages) => pages.filter((page) => page.docId !== docId))
	}

	return {
		subscribe,
		set,
		update,
		add,
		loadThumbnail,
		loadPreview,
		showPages,
		hidePages,
		removePage,
		removeDocPages,
		rotate
	}
}

export const pages = handlePages()
