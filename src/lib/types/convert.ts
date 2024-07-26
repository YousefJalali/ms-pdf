import type { PDFPageProxy } from 'pdfjs-dist'

export type PDFPage = PDFPageProxy

export type Doc = {
	docId: string
	name: string
	size: number
	pageCount: number
	color: string
	file: File
	destroyDoc: () => Promise<boolean>
	pagesPdfProxy: {
		[pageId: string]: PDFPage
	}
}
