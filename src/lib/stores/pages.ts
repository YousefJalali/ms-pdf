import { get, writable } from 'svelte/store'
import { getInputAsUint8Array } from '../utils'
import type { PDFPage, Page } from '../types'
import { docs } from './docs'
import { PDFDocument } from 'pdf-lib'
import { mergedPdf } from './mergedPdf'

function handlePages() {
	const { subscribe, set, update } = writable<Page[]>([])

	type NewPage = {
		pageId: string
		docId: string
		pageNum: number
		pageVisible: boolean
		pdfPage: PDFPage
		loadThumbnail: boolean
	}
	function add({ pageId, docId, pageNum, pdfPage, pageVisible, loadThumbnail }: NewPage) {
		let newPage: Page = {
			id: pageId,
			pageId,
			docId,
			pageNum,
			pdfPage,
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

		// for (let page of get(pages)) {
		// 	if (page.docId === docId) {
		// 		if (!page.loadThumbnail) {
		// 			loadThumbnail(page.pageId)
		// 		}
		// 		update((pages) =>
		// 			pages.map((p) => (p.pageId === page.pageId ? { ...p, pageVisible: true } : p))
		// 		)
		// 	}
		// }
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

	async function merge() {
		mergedPdf.setLoading(true)

		try {
			let merger = await PDFDocument.create()

			//load pages
			// for (const page of get(pages)) {
			// 	if (!page.file) {
			// 		let { doc, name } = get(docs)[page.docId]
			// 		await loadPage(page.pageId)
			// 	}
			// }

			for (const page of get(pages)) {
				loadPreview(page.pageId)

				let src = await getInputAsUint8Array(page.pdfPage)
				let pdfDoc = await PDFDocument.load(src)

				let indices = pdfDoc.getPageIndices()
				const copiedPages = await merger.copyPages(pdfDoc, indices)

				for (let page of copiedPages) {
					merger.addPage(page)
				}
			}

			const merged = await merger.save()
			let blob = new Blob([merged], {
				type: 'application/pdf'
			})

			mergedPdf.setSrc(URL.createObjectURL(blob))
			mergedPdf.setLoading(false)
		} catch (error) {
			mergedPdf.setLoading(false)
			console.log(error)
		}
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
		merge
	}
}

export const pages = handlePages()
