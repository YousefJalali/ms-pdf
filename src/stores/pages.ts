import { derived, get, type Readable } from 'svelte/store'
import { getInputAsUint8Array } from '../utils'
import { PDFDocument } from 'pdf-lib'
import { docs } from './docs'

type Preview = {
	id: string
	docId: string
	name: string
	parentId: string
	file: File
	size: number
}

type DocsDetails = {
	[key: string]: {
		pageCount: number
		size: number
	}
}

export const docsDetails: Readable<DocsDetails> = derived(
	docs,
	($st, set) => {
		Promise.resolve(getNumOfPages($st)).then((value) => {
			set(value)
		})
	},
	{}
)

async function getNumOfPages(files: Preview[]) {
	let updatedPages: DocsDetails = get(docsDetails)
	for (let file of files) {
		if (!updatedPages[file.parentId]) {
			const src = await getInputAsUint8Array(file.file)
			const pdfDoc = await PDFDocument.load(src, {
				ignoreEncryption: true
			})

			updatedPages[file.parentId] = {
				pageCount: pdfDoc.getPageCount(),
				size: file.size
			}
		}
	}

	return docsDetails
}
