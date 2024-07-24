import { get, writable } from 'svelte/store'
import { pages } from './pages'

function handlePreview() {
	const { set, update, subscribe } = writable<string[]>([])

	async function add(pageId: string) {
		if (get(preview).find((pId) => pId === pageId)) return

		update((p) => [...p, pageId])

		let pageIndex = get(pages).findIndex((p) => p.pageId === pageId)
		let page = get(pages)[pageIndex]

		if (!page.loadPreview) {
			pages.loadPreview(pageId)
		}

		for (let i = pageIndex + 1; i < get(pages).length; i++) {
			let p = get(pages)[i]

			if (!p.pageVisible) {
				preview.add(p.pageId)
			} else {
				break
			}
		}
	}

	async function next(index: number) {
		if (index >= get(preview).length) return

		await load(index)
	}

	async function prev(index: number) {
		if (index < 0) return

		await load(index)
	}

	async function load(index: number) {
		let pageId = get(preview)[index]
		let page = get(pages).find((p) => p.pageId === pageId)

		if (!page) return

		if (!page.loadThumbnail) {
			await pages.loadThumbnail(page.pageId)
		}

		if (!page.loadPreview) {
			pages.loadPreview(page.pageId)
		}
	}

	function remove(pageId: string) {
		update((ids) => ids.filter((id) => id !== pageId))
	}

	function clear() {
		// let previews = [...get(preview)]

		// if (previews.length > 1) {
		// 	for (let i = 1; i < previews.length; i++) {
		// 		// pages.setPageVisibility(previews[i], false)
		// 	}
		// }

		set([])
	}

	return {
		subscribe,
		add,
		next,
		prev,
		remove,
		clear
	}
}

export const preview = handlePreview()
