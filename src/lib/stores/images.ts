import type { Canvas, CreateImage } from '$lib/types'
import { getPageAsBlob } from '$lib/utils'
import { get, writable } from 'svelte/store'

function handleImages(size: 'small' | 'large') {
	const { subscribe, set, update } = writable<Canvas>({})

	async function create(pagesPdfProxy: CreateImage) {
		let newThumbs: Canvas = {}
		let blobsPromise = []
		let store = size === 'small' ? get(thumbnails) : get(previews)

		for (let pageId in pagesPdfProxy) {
			if (!store[pageId]) {
				blobsPromise.push(
					getPageAsBlob(pagesPdfProxy[pageId].pdfPage, size).then((src) => ({
						src,
						pageId,
						docId: pagesPdfProxy[pageId].docId
					}))
				)
			}
		}

		if (blobsPromise.length) {
			let blobs = await Promise.all(blobsPromise)

			let pageNumberInDoc = 1

			for (let blob of blobs) {
				if (blob.src) {
					newThumbs = {
						...newThumbs,
						[blob.pageId]: {
							src: blob.src,
							docId: blob.docId,
							pageNumberInDoc
						}
					}
					pageNumberInDoc++
				}
			}
		}

		if (Object.keys(newThumbs).length) update((thumbs) => ({ ...thumbs, ...newThumbs }))
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

export const thumbnails = handleImages('small')
export const previews = handleImages('large')
