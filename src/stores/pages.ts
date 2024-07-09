import { derived, get, type Readable, type Subscriber } from 'svelte/store'
import { getPages } from '../utils'
import { docs } from './docs'
import type { Doc, Docs, Page } from '../types'

export const pages = derived<Readable<Docs>, Page[]>(
	docs,
	($st, set, update) => {
		Object.values($st).forEach((doc) => {
			update((pages) => [...pages, ...doc.pages])
		})
	},
	[]
)
