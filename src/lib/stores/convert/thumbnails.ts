import type { PDFPage } from '$lib/types/convert'
import { getPageAsBlob } from '$lib/utils'
import { get, writable } from 'svelte/store'

function handleThumbnails() {
	const { subscribe, set, update } = writable<{
		[pageId: string]: { src: Blob; docId: string; pageNumber: number }
	}>({})

	async function add(pagesPdfProxy: { [pageId: string]: PDFPage }, docId: string) {
		let blobsPromise = []

		for (let pageId in pagesPdfProxy) {
			if (!get(thumbnails)[pageId]) {
				blobsPromise.push(getPageAsBlob(pagesPdfProxy[pageId], pageId))
			}
		}

		let newThumbs = {}
		if (blobsPromise.length) {
			let blobs = await Promise.all(blobsPromise)
			let pageNumber = 1
			for (let blob of blobs) {
				if (!(blob instanceof Blob) && blob?.src) {
					newThumbs = {
						...newThumbs,
						[blob.pageId]: {
							src: blob.src,
							docId,
							pageNumber
						}
					}

					pageNumber++
				}
			}

			update((thumbs) => ({ ...thumbs, ...newThumbs }))
		}
	}

	function removeAll() {
		set({})
	}

	return {
		subscribe,
		set,
		add,
		removeAll
	}
}

export const thumbnails = handleThumbnails()
