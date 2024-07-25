import type { Doc } from '$lib/types/convert'
import { writable } from 'svelte/store'

function handleFiles() {
	const { subscribe, set, update } = writable<{ [docId: string]: Doc }>({})
}
