import { writable } from 'svelte/store'

function handlePreview() {
	const { set, update, subscribe } = writable<string[]>([])

	return {
		subscribe,
		add: (pageId: string) => update((p) => [...p, pageId]),
		clear: () => {
			console.log('cleared')
			set([])
		}
	}
}

export const preview = handlePreview()
