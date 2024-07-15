import type { PDFDocument } from 'pdf-lib'

export type PDF = PDFDocument

export type Docs = { [docId: string]: Doc }

export type Doc = {
	docId: string
	name: string
	size: number
	file: File
	doc: PDF
	pageCount: number
	showPages: boolean
	color: string
}

export type Page = {
	id: string
	pageId: string
	docId: string
	pageNum: number
	pageVisible: boolean
	file: File | null
	loadPreview: boolean
}

export type Thumbnail = {
	[key: string]: {
		thumbnail:
			| {
					status: 'loading' | 'failed'
					src: null
			  }
			| {
					status: 'loaded'
					src: string
			  }

		preview:
			| {
					status: 'loading' | 'failed'
					src: null
			  }
			| {
					status: 'loaded'
					src: string
			  }
	}
}

export type DocsDetails = {
	[key: string]: {
		pageCount: number
		size: number
	}
}
