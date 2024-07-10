import { get, writable } from 'svelte/store'
import { getPage } from '../utils'
import type { PDF, Page } from '../types'
import { docs } from './docs'

function handlePages() {
	const { subscribe, set, update } = writable<Page[]>([])

	function add(pageId: string, docId: string, pageNum: number, pageVisible: boolean) {
		let newPage: Page = {
			id: pageId,
			pageId,
			docId,
			pageNum,
			pageVisible,
			file: null
		}
		update((pages) => [...pages, newPage])
	}

	async function loadPage(doc: PDF, pageId: string, docName: string, pageNum: number) {
		let p = await getPage(doc, docName, pageNum)
		update((pages) =>
			pages.map((page) => (page.pageId === pageId ? { ...page, file: p.file } : page))
		)
	}

	async function showPages(docId: string) {
		const doc = get(docs)[docId]

		if (doc.pageCount <= 1) return

		for (let page of get(pages)) {
			if (page.docId === docId) {
				if (!page.file) {
					loadPage(doc.doc, page.pageId, doc.name, page.pageNum)
				}
				update((pages) =>
					pages.map((p) => (p.pageId === page.pageId ? { ...p, pageVisible: true } : p))
				)
			}
		}
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

	function removePage(pageId: string) {
		let docId = ''
		update((pages) =>
			pages.filter((page) => {
				if (page.pageId === pageId) docId = page.docId
				return page.pageId !== pageId
			})
		)

		docs.decreasePageCount(docId)
	}

	function removeDocPages(docId: string) {
		update((pages) => pages.filter((page) => page.docId !== docId))
	}

	return {
		subscribe,
		set,
		update,
		add,
		loadPage,
		showPages,
		hidePages,
		removePage,
		removeDocPages
	}
}

export const pages = handlePages()
