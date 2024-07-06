import { writable } from 'svelte/store'

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

function handleMergedPdf() {
	const { subscribe, set, update } = writable<null | { url: string; previews: string[] }>(null)

	function getSrc(items: Thumbnail) {
		let res = []

		for (let t in items) {
			let thumbnail = items[t]
			if (thumbnail.status === 'loaded') {
				res.push(thumbnail.src)
			}
		}

		return res
	}

	return {
		subscribe,
		set: (url: string, items: Thumbnail) => set({ url, previews: getSrc(items) })
	}
}

export const mergedPdf = handleMergedPdf()
