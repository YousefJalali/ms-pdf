import { derived, get, type Readable } from 'svelte/store'
import { randomColor } from '../utils'
import { previews } from './docs'

export const colors: Readable<{ [key: string]: { name: string; color: string } }> = derived(
	previews,
	($st, set, update) => {
		let colorsToBeRemoved = { ...get(colors) }
		for (let f of $st) {
			delete colorsToBeRemoved[f.parentId]

			if (!get(colors)[f.parentId]) {
				let newColor = {
					[f.parentId]: { name: f.name, color: randomColor() }
				}
				update((c) => ({ ...c, ...newColor }))
			}
		}

		//clear colors of removed docs
		if (Object.keys(colorsToBeRemoved).length) {
			let temp = { ...get(colors) }
			for (let key in colorsToBeRemoved) {
				delete temp[key]
			}
			set(temp)
			colorsToBeRemoved = {}
		}
	},
	{}
)
