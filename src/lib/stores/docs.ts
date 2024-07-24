import { get, writable } from 'svelte/store'
import { randomColor, getPdfPage, getInputAsUint8Array } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import type { Doc } from '../types'
import { pages } from './pages'
import { preview } from './preview'
import { mergedPdf } from './mergedPdf'
import { PDFDocument } from 'pdf-lib'

function handleFiles() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})

	async function add(file: File) {
		let docId = uuidv4()

		let res = await getPdfPage(file)

		if (!res) throw 'Failed loading doc'

		let { pdfPages, destroy } = res

		let pageCount = pdfPages.length

		let pageIds = new Array(pageCount).fill(0).map((p) => uuidv4())

		let pagesPdfProxy = {}

		for (let i = 0; i < pageIds.length; i++) {
			pagesPdfProxy = {
				...pagesPdfProxy,
				[pageIds[i]]: pdfPages[i]
			}
		}

		let newDoc: Doc = {
			docId,
			file,
			name: file.name,
			size: file.size,
			showPages: false,
			pageCount,
			color: randomColor(),
			destroyDoc: destroy,
			pagesPdfProxy
		}

		update((docs) => ({ ...docs, [docId]: newDoc }))

		for (let i = 0; i < pageIds.length; i++) {
			pages.add({
				pageId: pageIds[i],
				docId,
				pageNum: i,
				pageVisible: i === 0 ? true : false,
				loadThumbnail: i === 0 ? true : false
			})
		}
	}

	function toggleShowPages(docId: string) {
		update((docs) => ({
			...docs,
			[docId]: {
				...docs[docId],
				showPages: !docs[docId].showPages
			}
		}))
		if (get(docs)[docId].showPages) {
			pages.showPages(docId)
		} else {
			pages.hidePages(docId)
		}
	}

	async function removeDoc(docId: string) {
		let destroyed = await get(docs)[docId].destroyDoc()

		let d = { ...get(docs) }

		if (destroyed) {
			delete d[docId]

			set(d)

			pages.removeDocPages(docId)
		}
	}

	function decreasePageCount(docId: string, numOfPages: number) {
		let d = { ...get(docs) }

		d[docId].pageCount = d[docId].pageCount - numOfPages

		if (d[docId].pageCount < 1) {
			removeDoc(docId)
		}

		set(d)
	}

	async function merge() {
		mergedPdf.setLoading(true)

		const allPages = [...get(pages)]
		const allDocs = { ...get(docs) }
		let docPages: { [docId: string]: number[] } = {}

		try {
			let merger = await PDFDocument.create()

			for (let page of allPages) {
				if (!page.loadThumbnail) {
					pages.loadThumbnail(page.pageId)
				}
				if (!page.loadPreview) {
					pages.loadPreview(page.pageId)
				}

				if (!docPages[page.docId]) {
					docPages[page.docId] = []
				}
				docPages[page.docId].push(page.pageNum)
			}

			for (let docId in docPages) {
				let src = await getInputAsUint8Array(allDocs[docId].file)
				let pdfDoc = await PDFDocument.load(src)
				const copiedPages = await merger.copyPages(pdfDoc, docPages[docId])

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

	async function destroyAllDocs() {
		let removedDocs = []
		for (let docId in get(docs)) {
			removedDocs.push(await get(docs)[docId].destroyDoc())
		}

		await Promise.all(removedDocs)
	}

	function reset() {
		docs.set({})
		pages.set([])
		preview.clear()
		mergedPdf.reset()
	}

	return {
		subscribe,
		set,
		update,
		add,
		toggleShowPages,
		removeDoc,
		decreasePageCount,
		split: (docId: string) => {},
		merge,
		destroyAllDocs,
		reset
	}
}

export const docs = handleFiles()
