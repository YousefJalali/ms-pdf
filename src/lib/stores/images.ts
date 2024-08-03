import type { Canvas, PDFPage } from '$lib/types'
import { getPageAsBlob } from '$lib/utils'
import { get, writable } from 'svelte/store'

function handleImages() {
	const { subscribe, set, update } = writable<Canvas>({})

	async function create(pagesPdfProxy: { [pageId: string]: PDFPage }, docId: string) {
		let blobsPromise = []

		for (let pageId in pagesPdfProxy) {
			if (!get(thumbnails)[pageId]) {
				blobsPromise.push(getPageAsBlob(pagesPdfProxy[pageId], pageId))
			}
		}

		let newThumbs: Canvas = {}
		if (blobsPromise.length) {
			let blobs = await Promise.all(blobsPromise)

			let pageNumberInDoc = 1

			for (let blob of blobs) {
				if (!(blob instanceof Blob) && blob?.src) {
					console.log(pageNumberInDoc)
					newThumbs = {
						...newThumbs,
						[blob.pageId]: {
							src: blob.src,
							docId,
							pageNumberInDoc
						}
					}

					pageNumberInDoc++
				}
			}

			update((thumbs) => ({ ...thumbs, ...newThumbs }))
		}
	}

	function deleteDoc(store: Canvas, docId: string) {
		let allImgs = { ...store }
		for (let thumb in allImgs) {
			if (allImgs[thumb].docId === docId) {
				delete allImgs[thumb]
			}
		}

		return allImgs
	}

	function deletePage(store: Canvas, pageIds: string[]) {
		let allImgs = { ...store }
		for (let pageId of pageIds) {
			delete allImgs[pageId]
		}

		return allImgs
	}

	function reset() {
		set({})
	}

	return {
		subscribe,
		create,
		deleteDoc: (docId: string) => update((store) => deleteDoc(store, docId)),
		deletePage: (pageIds: string[]) => update((store) => deletePage(store, pageIds)),
		reset
	}
}

export const thumbnails = handleImages()
export const previews = handleImages()
