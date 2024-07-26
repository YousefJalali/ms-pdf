import type { Doc, PDFPage } from '$lib/types/convert'
import { getPdfPage, randomColor } from '$lib/utils'
import { get, writable } from 'svelte/store'
import { v4 as uuidv4 } from 'uuid'
import { thumbnails } from './thumbnails'

function uploading() {
	const { subscribe, set, update } = writable<boolean>(false)
	return {
		subscribe,
		set
	}
}

export const uploadingDocs = uploading()

function handleDocs() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})

	async function add(file: File) {
		uploadingDocs.set(true)

		let docId = uuidv4()

		let res = await getPdfPage(file)

		if (!res) throw 'Failed loading doc'

		let { pdfPages, destroy } = res

		let pageCount = pdfPages.length

		let pageIds = new Array(pageCount).fill(0).map((p) => uuidv4())

		let pagesPdfProxy: { [pageId: string]: PDFPage } = {}

		for (let i = 0; i < pageIds.length; i++) {
			pagesPdfProxy = {
				...pagesPdfProxy,
				[pageIds[i]]: pdfPages[i]
			}
		}

		let newDoc: Doc = {
			docId,
			file,
			name: file.name,
			size: file.size,
			pageCount: pdfPages.length,
			color: randomColor(),
			destroyDoc: destroy,
			pagesPdfProxy
		}

		update((docs) => ({ ...docs, [docId]: newDoc }))

		await thumbnails.add(newDoc.pagesPdfProxy)

		uploadingDocs.set(false)
	}

	async function destroyAll() {
		let removedDocs = []
		for (let docId in get(docs)) {
			removedDocs.push(await get(docs)[docId].destroyDoc())
		}

		await Promise.all(removedDocs)

		thumbnails.removeAll()
		docs.set({})
	}

	return {
		subscribe,
		set,
		add,
		destroyAll
	}
}

export const docs = handleDocs()
