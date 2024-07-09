export type Docs = { [docId: string]: Doc }

export type Doc = {
	id: string
	docId: string
	name: string
	size: number
	file: File
	showPages: boolean
	pageCount: number
	color: string
	pages: Page[]
}

export type Page = { id: string; docId: string; pageNum: number; hidden: boolean; file: File }

export type Thumbnail = {
	[key: string]:
		| {
				status: 'loading' | 'failed'
				src: null
		  }
		| {
				status: 'loaded'
				src: string
		  }
}

export type DocsDetails = {
	[key: string]: {
		pageCount: number
		size: number
	}
}
