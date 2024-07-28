import type { Color, PDFPage } from './common'

export type DocConvert = {
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
