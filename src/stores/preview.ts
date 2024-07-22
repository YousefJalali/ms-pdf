import { get, writable } from 'svelte/store'
import { pages } from './pages'
import { docs } from './docs'

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

		if (pageIndex !== get(pages).length - 1) {
			for (let i = pageIndex + 1; i < get(pages).length; i++) {
				let p = get(pages)[i]

				if (!p.pageVisible) {
					preview.add(p.pageId)
				} else {
					break
				}
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

		if (!page.file) {
			let doc = get(docs)[page.docId]
			await pages.loadPage(doc.doc, page.pageId, doc.name, page.pageNum)
		}

		if (!page.loadPreview) {
			pages.loadPreview(page.pageId)
		}
	}

	return {
		subscribe,
		add,
		next,
		prev,
		clear: () => set([])
	}
}

export const preview = handlePreview()
