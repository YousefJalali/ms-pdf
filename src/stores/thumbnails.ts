import { derived, get, type Readable } from 'svelte/store'
import { getCanvasDataURL } from '../utils'
import type { Thumbnail } from '../types'
import { pages } from './pages'

export const thumbnails: Readable<Thumbnail> = derived(
	pages,
	($st, set, update) => {
		let hasNewItem = false
		let removedPages = { ...get(thumbnails) }

		Promise.allSettled([
			//load thumbnail
			...$st.map((page) => {
				if (!page.file) return []

				//remove thumbnails of removed pages
				if (removedPages[page.pageId]) {
					delete removedPages[page.pageId]
				}

				if (!get(thumbnails)[page.pageId]) {
					hasNewItem = true
					let newThumbnail: Thumbnail = {
						[page.pageId]: {
							thumbnail: { status: 'loading', src: null },
							preview: { status: 'loading', src: null }
						}
					}
					update((thumb) => ({
						...thumb,
						...newThumbnail
					}))
					return getCanvasDataURL(page.file, page.pageId)
				}

				return []
			}),

			//load preview
			...$st.map((page) => {
				if (!page.file || !get(thumbnails)[page.pageId]) return []

				if (page.loadPreview && !get(thumbnails)[page.pageId].preview.src) {
					hasNewItem = true
					return getCanvasDataURL(page.file, page.pageId, 1, 'preview')
				}

				return []
			})
		]).then((value) => {
			if (hasNewItem) {
				value.forEach((v) => {
					if (v.status === 'fulfilled' && v.value && Object.keys(v.value).length) {
						//@ts-ignore
						const { id, src, type } = v.value

						update((thumb) => ({
							...thumb,
							[id]: {
								...get(thumbnails)[id],
								[type]: { status: 'loaded', src: src }
							}
						}))
					}
				})
				hasNewItem = false
			}

			//remove thumbnails of removed pages
			if (Object.keys(removedPages).length) {
				let temp = { ...get(thumbnails) }
				for (let key in removedPages) {
					delete temp[key]
				}
				set(temp)
				removedPages = {}
			}
		})
	},
	{}
)
