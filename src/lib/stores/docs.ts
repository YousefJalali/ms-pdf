import { get, writable } from 'svelte/store'
import { getPdfPage } from '$lib/utils'
import { v4 as uuidv4 } from 'uuid'
import type { CreateImage, Doc, PDFPage } from '$lib/types'
import { colors } from './colors'
import { pages } from './pages'
import { previews, thumbnails } from './images'
import { mergedPdf } from './mergedPdf'
import { alerts } from './alerts'
import { TriangleAlert } from 'lucide-svelte'

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
		try {
			uploadingDocs.set(true)

			let res = await getPdfPage(file)

			// if (!res || res.error) throw res.error

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
				showPages,
				pageCount,
				color: colors.pick(),
				destroyDoc: destroy,
				pagesPdfProxy
			}

			update((docs) => ({ ...docs, [newDoc.docId]: newDoc }))

			const visiblePageIds: CreateImage = {}
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
					visiblePageIds[pageId] = {
						pdfPage: pagesPdfProxy[pageId],
						docId: newDoc.docId
					}
				}
			}

			//create thumbnails for visible pages
			thumbnails.create(visiblePageIds)

			uploadingDocs.set(false)
		} catch (error) {
			uploadingDocs.set(false)

			if (typeof error === 'string') {
				alerts.add(TriangleAlert, 'Error', error)
			} else if (error instanceof ReferenceError) {
				alerts.add(TriangleAlert, 'Error', error.message)
			} else {
				alerts.add(TriangleAlert, 'Error', 'Invalid Type')
			}
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
		let allDocs = { ...get(docs) }

		allDocs[docId].pageCount = allDocs[docId].pageCount - numOfPages

		if (allDocs[docId].pageCount < 1) {
			// deleteDoc(docId)
			delete allDocs[docId]
		}

		if (!Object.keys(allDocs)) {
			reset()
		} else {
			set(allDocs)
		}
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
		previews.reset()
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
