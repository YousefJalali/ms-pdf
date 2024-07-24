// import type { PDFDocument } from 'pdf-lib'
import type { PDFPageProxy } from 'pdfjs-dist'

// export type PDF = PDFDocument
export type PDFPage = PDFPageProxy

export type Docs = { [docId: string]: Doc }

export type Doc = {
	docId: string
	name: string
	size: number
	pageCount: number
	showPages: boolean
	color: string
}

export type Page = {
	id: string
	pageId: string
	docId: string
	pageNum: number
	pdfPage: PDFPage
	pageVisible: boolean
	loadThumbnail: boolean
	loadPreview: boolean
}

export type Image = {
	[key: string]: {
		small: Blob | null
		large: Blob | null
	}
}

export type DocsDetails = {
	[key: string]: {
		pageCount: number
		size: number
	}
}
