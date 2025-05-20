import type { Plus } from 'lucide-svelte'
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

export type Docs = { [docId: string]: Doc }

export type Doc = {
	docId: string
	name: string
	size: number
	pageCount: number
	showPages: boolean
	color: string
	file: File
	destroyDoc: () => Promise<boolean>
	pagesPdfProxy: {
		[pageId: string]: PDFPage
	}
}

export type Page = {
	id: string
	pageId: string
	docId: string
	pageNum: number
	isVisible: boolean
	initialRotation: number
	rotationDegree: number | undefined
}
// export type Page = {
// 	id: string
// 	pageId: string
// 	docId: string
// 	pageNum: number
// 	pageVisible: boolean
// 	loadThumbnail: boolean
// 	loadPreview: boolean
// 	initialRotation: number
// 	rotationDegree: number | undefined
// }

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

export type Icon = typeof Plus
export type Alert = {
	id: string
	Icon: Icon
	title: string
	message: string
}

export type CreateImage = { [pageId: string]: { pdfPage: PDFPage; docId: string } }
