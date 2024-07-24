import { get, writable } from 'svelte/store'
import type { Page } from '../types'
import { docs } from './docs'

function handlePages() {
	const { subscribe, set, update } = writable<Page[]>([])

	type NewPage = {
		pageId: string
		docId: string
		pageNum: number
		pageVisible: boolean
		loadThumbnail: boolean
	}
	function add({ pageId, docId, pageNum, pageVisible, loadThumbnail }: NewPage) {
		let newPage: Page = {
			id: pageId,
			pageId,
			docId,
			pageNum,
			pageVisible,
			loadPreview: false,
			loadThumbnail
		}
		update((pages) => [...pages, newPage])
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
		removeDocPages
	}
}

export const pages = handlePages()
