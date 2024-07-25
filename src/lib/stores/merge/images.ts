import { derived, get, type Readable } from 'svelte/store'
import { getPageAsBlob } from '$lib/utils'
import type { Image } from '$lib/types/merge'
import { pages } from './pages'
import { docs } from './docs'

export const images: Readable<Image> = derived(
	pages,
	($st, set, update) => {
		let hasNewItem = false
		let removedPages = { ...get(images) }
		let hasLoadPreview = false

		Promise.allSettled([
			//load thumbnail
			...$st.map((page) => {
				//remove images of removed pages
				if (removedPages[page.pageId]) {
					delete removedPages[page.pageId]
				}

				if (!page.loadThumbnail || !get(docs)[page.docId]) return []

				let pdfProxy = get(docs)[page.docId].pagesPdfProxy[page.pageId]

				//if one page has load preview, the block of loading previews will be run
				if (page.loadPreview) {
					hasLoadPreview = true
				}

				//add key to $images
				if (!get(images)[page.pageId]) {
					hasNewItem = true
					let newImage: Image = {
						[page.pageId]: {
							small: null,
							large: null
						}
					}
					update((images) => ({
						...images,
						...newImage
					}))

					return getPageAsBlob(pdfProxy, page.pageId)
				}

				return []
			}),

			//load preview
			...(hasLoadPreview
				? $st.map((page) => {
						if (!page.loadThumbnail || !get(images)[page.pageId] || !get(docs)[page.docId])
							return []

						let pdfProxy = get(docs)[page.docId].pagesPdfProxy[page.pageId]

						if (page.loadPreview && !get(images)[page.pageId].large) {
							hasNewItem = true
							return getPageAsBlob(pdfProxy, page.pageId, 'large')
						}

						return []
					})
				: [])
		]).then((value) => {
			if (hasNewItem || hasLoadPreview) {
				value.forEach((v) => {
					if (v.status === 'fulfilled' && v.value && Object.keys(v.value).length) {
						//@ts-ignore
						const { pageId, src, type } = v.value

						update((images: Image) => ({
							...images,
							[pageId]: {
								...images[pageId],
								[type]: src
							}
						}))
					}
				})
				hasNewItem = false
				hasLoadPreview = false
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
