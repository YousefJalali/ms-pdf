import { get, writable } from 'svelte/store'
import { pages } from './pages'
import { previews } from './images'
import { docs } from './docs'
import type { Page } from '$lib/types'

type ModalPreview = {
	isModalVisible: boolean
	currentPageIndex: number
}

function handlePreview() {
	const { subscribe, set, update } = writable<ModalPreview>({
		isModalVisible: false,
		currentPageIndex: 0
	})

	function createPreview(page: Page) {
		let pageId = page.pageId
		if (!get(previews)[pageId]) {
			let doc = get(docs)[page.docId]
			previews.create({ [pageId]: doc.pagesPdfProxy[pageId] }, doc.docId)
		}
	}

	function next(store: ModalPreview) {
		if (store.currentPageIndex >= get(pages).length - 1) return store

		createPreview(get(pages)[store.currentPageIndex + 1])

		return {
			...store,
			currentPageIndex: store.currentPageIndex + 1
		}
	}

	function prev(store: ModalPreview) {
		if (store.currentPageIndex <= 0) return store

		return {
			...store,
			currentPageIndex: store.currentPageIndex - 1
		}
	}

	return {
		subscribe,
		next: () => update((store) => next(store)),
		prev: () => update((store) => prev(store)),
		show: (currentPageIndex: number) =>
			set({
				isModalVisible: true,
				currentPageIndex
			}),
		hide: () =>
			set({
				isModalVisible: false,
				currentPageIndex: 0
			})
	}
}

export const previewModal = handlePreview()
