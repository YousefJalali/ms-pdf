import { writable } from 'svelte/store'

function handlePreview() {
	const { subscribe, set } = writable(false)

	return {
		subscribe,
		show: () => set(true),
		hide: () => set(false)
	}
}

export const previewModal = handlePreview()
