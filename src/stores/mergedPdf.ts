import { writable } from 'svelte/store'

function handleMergedPdf() {
	const { subscribe, set, update } = writable<null | string>(null)

	return {
		subscribe,
		set: (url: string) => set(url),
		reset: () => set(null)
	}
}

export const mergedPdf = handleMergedPdf()
