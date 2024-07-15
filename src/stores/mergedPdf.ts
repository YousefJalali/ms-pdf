import { writable } from 'svelte/store'

function handleMergedPdf() {
	const { subscribe, set, update } = writable<{
		loading: boolean
		src: string | null
	}>({ loading: false, src: null })

	return {
		subscribe,
		setLoading: (loading: boolean) => set({ loading, src: null }),
		setSrc: (src: string) => set({ loading: false, src }),
		reset: () => set({ loading: false, src: null })
	}
}

export const mergedPdf = handleMergedPdf()
