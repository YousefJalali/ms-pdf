import { get, writable } from 'svelte/store'
import { randomColor, getPdfPage } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import type { Doc } from '../types'
import { pages } from './pages'
import { preview } from './preview'
import { mergedPdf } from './mergedPdf'

function handleFiles() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})

	async function add(file: File) {
		let docId = uuidv4()
		let pdfPages = await getPdfPage(file)

		if (!pdfPages) throw 'Failed loading doc'

		let newDoc: Doc = {
			docId,
			name: file.name,
			size: file.size,
			showPages: false,
			pageCount: pdfPages.length,
			color: randomColor()
		}

		update((docs) => ({ ...docs, [docId]: newDoc }))

		for (let i = 0; i < newDoc.pageCount; i++) {
			let pageId = uuidv4()

			pages.add({
				pageId,
				docId,
				pdfPage: pdfPages[i],
				pageNum: 0,
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

	function removeDoc(docId: string) {
		let d = { ...get(docs) }
		delete d[docId]

		set(d)
		pages.removeDocPages(docId)
	}

	function decreasePageCount(docId: string, numOfPages: number) {
		let d = { ...get(docs) }

		d[docId].pageCount = d[docId].pageCount - numOfPages

		if (d[docId].pageCount < 1) {
			delete d[docId]
		}

		set(d)
	}

	function reset() {
		set({})
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
		reset
	}
}

export const docs = handleFiles()
