export type Doc = {
	id: string
	docId: string
	parentId: string
	name: string
	file: File
}

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
