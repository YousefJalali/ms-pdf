import { get, writable } from 'svelte/store'
import { getInputAsUint8Array, getPages, randomColor } from '../utils'
import { PDFDocument } from 'pdf-lib'
import { v4 as uuidv4 } from 'uuid'
import type { Doc, Page } from '../types'

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

	async function addDoc(file: File) {
		let [firstPage] = await getPages(file)
		let docId = uuidv4()

		let newDoc: Doc = {
			id: uuidv4(),
			docId,
			name: file.name,
			size: file.size,
			pageCount: firstPage.numberOfPages,
			file,
			showPages: false,
			color: randomColor(),
			pages: [
				{
					id: uuidv4(),
					docId,
					pageNum: 1,
					hidden: false,
					file: firstPage.file
				}
			]
		}

		update((docs) => ({ ...docs, [docId]: newDoc }))
		console.log(get(docs))
	}

	return {
		subscribe,
		set,
		update,
		addDoc,
		removePage: (id: string) => {},
		removeDoc: (docId: string) => {},
		split: (docId: string) => {},
		reset: () => set({})
	}
}

export const docs = handleFiles()
