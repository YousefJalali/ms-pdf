import { getInputAsUint8Array } from '../utils'
import { PDFDocument } from 'pdf-lib'

export async function getPages(file: File, pages: number | number[] = 1) {
	const src = await getInputAsUint8Array(file)
	const pdfDoc = await PDFDocument.load(src, {
		ignoreEncryption: true
	})

	const numberOfPages = pdfDoc.getPages().length

	if (typeof pages === 'number') {
		let file = await getFile()
		return [{ file, numberOfPages }]
	} else {
		const files = []
		for (let i = pages[0]; i < (pages[1] || pdfDoc.getPages().length); i++) {
			let file = await getFile(i)
			files.push({ file, numberOfPages })
		}
		return files
	}

	async function getFile(pageNum: number = 1) {
		// Create a new "sub" document
		const subDocument = await PDFDocument.create()
		// copy the page at current index
		const [copiedPage] = await subDocument.copyPages(pdfDoc, [pageNum])
		subDocument.addPage(copiedPage)
		const pdfBytes = await subDocument.save()

		const metadata = {
			type: 'application/pdf'
		}
		const blob = new Blob([pdfBytes], metadata)

		return new File([blob], `${file.name.split('.')[0]} (${pageNum}).pdf`, metadata)
	}
}
