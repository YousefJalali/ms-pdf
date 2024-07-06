import { derived, get, type Readable } from 'svelte/store'
import { getInputAsUint8Array } from '../utils'
import { PDFDocument } from 'pdf-lib'
import { previews } from './docs'

type Preview = {
	id: string
	docId: string
	name: string
	parentId: string
	file: File
	size: number
}

type Pages = {
	[key: string]: {
		pageCount: number
		size: number
	}
}

export const pages: Readable<Pages> = derived(
	previews,
	($st, set) => {
		Promise.resolve(getNumOfPages($st)).then((value) => {
			set(value)
		})
	},
	{}
)

async function getNumOfPages(files: Preview[]) {
	let updatedPages: Pages = get(pages)
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

	return pages
}
