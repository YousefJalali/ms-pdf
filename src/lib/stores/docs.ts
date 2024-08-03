import { get, writable } from 'svelte/store'
import { getPdfPage, getInputAsUint8Array } from '$lib/utils'
import { v4 as uuidv4 } from 'uuid'
import type { Canvas, Doc, PDFPage } from '$lib/types'
import { colors } from './colors'
import { pages } from './pages'
import { thumbnails } from './images'
// import { pages } from './pages'
// import { preview } from './preview'
// import { mergedPdf } from './mergedPdf'
// import { PDFDocument, degrees } from 'pdf-lib'
// import { colors } from '../colors'
// import { thumbnails } from './convert'

function uploading() {
	const { subscribe, set } = writable<boolean>(false)
	return {
		subscribe,
		set
	}
}

export const uploadingDocs = uploading()

function handleFiles() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})

	async function create(file: File, showPages = false) {
		uploadingDocs.set(true)

		let res = await getPdfPage(file)

		if (!res) throw 'Failed loading doc'

		let { pdfPages, destroy } = res

		let pageCount = pdfPages.length

		let pageIds = new Array(pageCount).fill(0).map((p) => uuidv4())

		let pagesPdfProxy: { [pageId: string]: PDFPage } = {}

		for (let i = 0; i < pageIds.length; i++) {
			pagesPdfProxy = {
				...pagesPdfProxy,
				[pageIds[i]]: pdfPages[i]
			}
		}

		let newDoc: Doc = {
			docId: uuidv4(),
			file,
			name: file.name,
			size: file.size,
			showPages: false,
			pageCount,
			color: colors.pick(),
			destroyDoc: destroy,
			pagesPdfProxy
		}

		update((docs) => ({ ...docs, [newDoc.docId]: newDoc }))

		const visiblePageIds: { [pageId: string]: PDFPage } = {}
		for (let i = 0; i < pageIds.length; i++) {
			const pageId = pageIds[i]

			const newPage = {
				pageId,
				docId: newDoc.docId,
				pageNum: i,
				isVisible: showPages ? true : i === 0 ? true : false,
				initialRotation: pagesPdfProxy[pageId].rotate
			}

			pages.create(newPage)

			if (newPage.isVisible) {
				visiblePageIds[pageId] = pagesPdfProxy[pageId]
			}
		}

		//create thumbnails for visible pages
		thumbnails.create(visiblePageIds, newDoc.docId)

		uploadingDocs.set(false)
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
			pages.showDocPages(docId)
		} else {
			pages.hideDocPages(docId)
		}
	}

	async function deleteDoc(docId: string) {
		let destroyed = await get(docs)[docId].destroyDoc()

		let d = { ...get(docs) }

		if (destroyed) {
			colors.returnColor(d[docId].color)

			delete d[docId]

			set(d)

			pages.deleteDocPages(docId)
			thumbnails.deleteDoc(docId)
		}
	}

	function decreasePageCount(docId: string, numOfPages: number) {
		let d = { ...get(docs) }

		d[docId].pageCount = d[docId].pageCount - numOfPages

		if (d[docId].pageCount < 1) {
			// deleteDoc(docId)
			delete d[docId]
		}

		set(d)
	}

	async function merge() {
		console.log('merge')
		// mergedPdf.setLoading(true)

		// const allPages = [...get(pages)]
		// const allDocs = { ...get(docs) }
		// let docPages: {
		// 	[docId: string]: { pageNumber: number[]; pageRotation: (number | undefined)[] }
		// } = {}

		// try {
		// 	let merger = await PDFDocument.create()

		// 	for (let page of allPages) {
		// 		if (!page.loadThumbnail) pages.loadThumbnail(page.pageId)
		// 		if (!page.loadPreview) pages.loadPreview(page.pageId)

		// 		if (!docPages[page.docId]) docPages[page.docId] = { pageNumber: [], pageRotation: [] }
		// 		docPages[page.docId].pageNumber.push(page.pageNum)
		// 		docPages[page.docId].pageRotation.push(
		// 			page.rotationDegree ? page.rotationDegree + page.initialRotation : undefined
		// 		)
		// 	}

		// 	for (let docId in docPages) {
		// 		let src = await getInputAsUint8Array(allDocs[docId].file)
		// 		let pdfDoc = await PDFDocument.load(src)
		// 		const copiedPages = await merger.copyPages(pdfDoc, docPages[docId].pageNumber)

		// 		for (let [index, copiedPage] of copiedPages.entries()) {
		// 			let rotation = docPages[docId].pageRotation[index]
		// 			if (rotation) {
		// 				copiedPage.setRotation(degrees(rotation))
		// 			}
		// 			merger.addPage(copiedPage)
		// 		}
		// 	}

		// 	const merged = await merger.save()
		// 	let blob = new Blob([merged], {
		// 		type: 'application/pdf'
		// 	})

		// 	mergedPdf.setSrc(URL.createObjectURL(blob))

		// 	mergedPdf.setLoading(false)
		// } catch (error) {
		// 	mergedPdf.setLoading(false)
		// 	console.log(error)
		// }
	}

	async function destroyAllDocs() {
		let removedDocs = []
		let allDocs = { ...get(docs) }

		for (let docId in allDocs) {
			removedDocs.push(await allDocs[docId].destroyDoc())
		}

		await Promise.all(removedDocs)
	}

	async function reset() {
		await destroyAllDocs()
		docs.set({})
		pages.reset()
		colors.reset()
		thumbnails.reset()
		// preview.clear()
		// mergedPdf.reset()
	}

	return {
		subscribe,
		set,
		create,
		toggleShowPages,
		deleteDoc,
		decreasePageCount,
		reset
	}
}

export const docs = handleFiles()
