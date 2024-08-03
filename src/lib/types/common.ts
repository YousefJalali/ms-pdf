import type { PDFPageProxy } from 'pdfjs-dist'

export type PDFPage = PDFPageProxy

export type Color = {
	bg: string
	fg: string
}

export type Canvas = {
	[pageId: string]: {
		src: Blob
		docId: string
		pageNumberInDoc: number
	}
}
