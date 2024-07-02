import { derived, type Readable } from 'svelte/store'
import { getInputAsUint8Array } from '../utils'
import { PDFDocument } from 'pdf-lib'
import { previews } from './docs'

type Preview = {
	id: string
	docId: string
	name: string
	parentId: string
	file: File
}

export const pages: Readable<{ [ket: string]: number }> = derived(
	previews,
	($st, set) => {
		Promise.resolve(getNumOfPages($st)).then((value) => {
			set(value)
		})
	},
	{}
)

async function getNumOfPages(files: Preview[]) {
	let pages: { [key: string]: number } = {}
	for (let file of files) {
		const src = await getInputAsUint8Array(file.file)
		const pdfDoc = await PDFDocument.load(src, {
			ignoreEncryption: true
		})

		pages[file.docId] = pdfDoc.getPages().length
	}

	return pages
}
