import { get, writable } from 'svelte/store'
import { randomColor, getPdf } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import type { Doc } from '../types'
import { pages } from './pages'

function handleFiles() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})

	async function add(file: File) {
		let docId = uuidv4()
		let doc = await getPdf(file)

		let newDoc: Doc = {
			docId,
			name: file.name,
			size: file.size,
			file,
			doc,
			showPages: false,
			pageCount: doc.getPageCount(),
			color: randomColor()
		}

		update((docs) => ({ ...docs, [docId]: newDoc }))

		for (let i = 0; i < newDoc.pageCount; i++) {
			let pageId = uuidv4()

			pages.add(pageId, docId, i, i === 0 ? true : false)

			if (i === 0) {
				pages.loadPage(doc, pageId, newDoc.name, i)
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

	return {
		subscribe,
		set,
		update,
		add,
		toggleShowPages,
		removeDoc,
		decreasePageCount,
		split: (docId: string) => {},
		reset: () => set({})
	}
}

export const docs = handleFiles()
