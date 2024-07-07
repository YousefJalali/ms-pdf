import { derived, get, type Readable } from 'svelte/store'
import { getInputAsUint8Array } from '../utils'
import { PDFDocument } from 'pdf-lib'
import { docs } from './docs'
import type { Doc, DocsDetails } from '../types'

export const docsDetails: Readable<DocsDetails> = derived(
	docs,
	($st, set) => {
		Promise.resolve(getNumOfPages($st)).then((value) => {
			set(value)
		})
	},
	{}
)

async function getNumOfPages(docs: Doc[]) {
	let updatedPages: DocsDetails = get(docsDetails)
	for (let { file, parentId } of docs) {
		if (!updatedPages[parentId]) {
			const src = await getInputAsUint8Array(file)
			const pdfDoc = await PDFDocument.load(src, {
				ignoreEncryption: true
			})

			updatedPages[parentId] = {
				pageCount: pdfDoc.getPageCount(),
				size: file.size
			}
		}
	}

	return docsDetails
}
