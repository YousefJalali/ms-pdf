import { derived, get, type Readable } from 'svelte/store'
import { getPageAsBlob } from '../utils'
import type { Image } from '../types'
import { pages } from './pages'

export const images: Readable<Image> = derived(
	pages,
	($st, set, update) => {
		let hasNewItem = false
		let removedPages = { ...get(images) }

		Promise.allSettled([
			//load thumbnail
			...$st.map((page) => {
				if (!page.file) return []

				//remove images of removed pages
				if (removedPages[page.pageId]) {
					delete removedPages[page.pageId]
				}

				if (!get(images)[page.pageId]) {
					hasNewItem = true
					let newImage: Image = {
						[page.pageId]: {
							small: null,
							large: null
						}
					}
					update((thumb) => ({
						...thumb,
						...newImage
					}))
					return getPageAsBlob(page.file, page.pageId)
				}

				return []
			}),

			//load preview
			...$st.map((page) => {
				if (!page.file || !get(images)[page.pageId]) return []

				if (page.loadPreview && !get(images)[page.pageId].large) {
					hasNewItem = true
					return getPageAsBlob(page.file, page.pageId, 1, 'large')
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
								...get(images)[id],
								[type]: src
							}
						}))
					}
				})
				hasNewItem = false
			}

			//remove images of removed pages
			if (Object.keys(removedPages).length) {
				let temp = { ...get(images) }
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
