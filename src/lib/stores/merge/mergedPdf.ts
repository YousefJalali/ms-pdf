import { writable } from 'svelte/store'

function handleMergedPdf() {
	const { subscribe, set, update } = writable<{
		loading: boolean
		src: string | null
	}>({ loading: false, src: null })

	return {
		subscribe,
		setLoading: (loading: boolean) => update((obj) => ({ ...obj, loading })),
		setSrc: (src: string) => set({ loading: false, src }),
		reset: () => set({ loading: false, src: null })
	}
}

export const mergedPdf = handleMergedPdf()
