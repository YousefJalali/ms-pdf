import { get, writable } from 'svelte/store'
import { randomColor, getPdf } from '../utils'
import { v4 as uuidv4 } from 'uuid'
import type { Doc } from '../types'
import { pages } from './pages'

function handleFiles() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})

	// async function split(fileId: string, pages = undefined) {
	// 	let inputIndex = get(docs).findIndex((f) => f.docId === fileId)
	// 	let file = get(docs)[inputIndex].file
	// 	const src = await getInputAsUint8Array(file)
	// 	const pdfDoc = await PDFDocument.load(src, {
	// 		ignoreEncryption: true
	// 	})

	// 	const numberOfPages = pdfDoc.getPages().length
	// 	let newDocs: Doc[] = []
	// 	for (let i = 0; i < numberOfPages; i++) {
	// 		// Create a new "sub" document
	// 		const subDocument = await PDFDocument.create()
	// 		// copy the page at current index
	// 		const [copiedPage] = await subDocument.copyPages(pdfDoc, [i])
	// 		subDocument.addPage(copiedPage)
	// 		const pdfBytes = await subDocument.save()

	// 		const metadata = {
	// 			type: 'application/pdf'
	// 		}
	// 		const blob = new Blob([pdfBytes], metadata)

	// 		const newFile = new File([blob], `${file.name.split('.')[0]} (${i + 1}).pdf`, metadata)

	// 		const id = uuidv4()
	// 		newDocs = [
	// 			...newDocs,
	// 			{ ...get(docs)[inputIndex], id, docId: id, file: newFile, name: newFile.name }
	// 		]
	// 	}
	// 	docs.update((d) => [...d.slice(0, inputIndex), ...newDocs, ...d.slice(inputIndex + 1)])
	// }

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
		console.log(d, get(docs))
		set(d)
		pages.removeDocPages(docId)
	}

	function decreasePageCount(docId: string) {
		let d = { ...get(docs) }

		if (d[docId].pageCount <= 1) {
			delete d[docId]
		} else {
			d[docId].pageCount--
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
