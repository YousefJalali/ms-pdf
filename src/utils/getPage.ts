import { PDFDocument } from 'pdf-lib'

export async function getPage(pdfDoc: PDFDocument, docName: string, pageNum: number) {
	let file = await getFile()
	return { file, pageNum }

	async function getFile() {
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

		return new File([blob], `${docName.split('.')[0]} (${pageNum}).pdf`, metadata)
	}
}
