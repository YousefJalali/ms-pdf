import { derived, get, type Readable } from 'svelte/store'
import { getThumbnail } from '../utils'
import { previews } from './docs'

type Thumbnail = {
	[key: string]:
		| {
				status: 'loading' | 'failed'
				src: null
		  }
		| {
				status: 'loaded'
				src: string
		  }
}

export const thumbnails: Readable<Thumbnail> = derived(
	previews,
	($st, set, update) => {
		let hasNewItem = false
		let thumbnailsToBeRemoved = { ...get(thumbnails) }

		Promise.allSettled(
			$st.map((f) => {
				//remove existing thumbnail from temp object
				if (thumbnailsToBeRemoved[f.docId]) {
					delete thumbnailsToBeRemoved[f.docId]
				}

				if (!get(thumbnails)[f.docId]) {
					hasNewItem = true
					let newThumbnail: Thumbnail = {
						[f.docId]: { status: 'loading', src: null }
					}
					update((thumb) => ({
						...thumb,
						...newThumbnail
					}))

					return getThumbnail(f)
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
