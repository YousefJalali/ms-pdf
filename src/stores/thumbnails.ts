import { derived, get, type Readable } from 'svelte/store'
import { getThumbnail } from '../utils'
import type { Thumbnail } from '../types'
import { pages } from './pages'

export const thumbnails: Readable<Thumbnail> = derived(
	pages,
	($st, set, update) => {
		let hasNewItem = false
		let thumbnailsToBeRemoved = { ...get(thumbnails) }

		Promise.allSettled(
			$st.map((page) => {
				if (!page.file) return []

				//remove existing thumbnail from temp object
				if (thumbnailsToBeRemoved[page.pageId]) {
					delete thumbnailsToBeRemoved[page.pageId]
				}

				if (!get(thumbnails)[page.pageId]) {
					hasNewItem = true
					let newThumbnail: Thumbnail = {
						[page.pageId]: { status: 'loading', src: null }
					}
					update((thumb) => ({
						...thumb,
						...newThumbnail
					}))

					return getThumbnail(page.file, page.pageId)
				} else {
					return []
				}
			})
		).then((value) => {
			if (hasNewItem) {
				value.forEach((v) => {
					if (v.status === 'fulfilled') {
						update((thumb) => ({
							...thumb,
							//@ts-ignore
							[v.value.id]: { status: 'loaded', src: v.value.src }
						}))
					}
				})
				hasNewItem = false
			}

			//remove thumbnails of removed pages
			if (Object.keys(thumbnailsToBeRemoved).length) {
				let temp = { ...get(thumbnails) }
				for (let key in thumbnailsToBeRemoved) {
					delete temp[key]
				}
				set(temp)
				thumbnailsToBeRemoved = {}
			}
		})
	},
	{}
)
