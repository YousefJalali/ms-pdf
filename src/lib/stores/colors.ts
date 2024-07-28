import { get, writable } from 'svelte/store'

const COLORS = [
	'#1A1A1A', // Very Dark Gray
	'#003366', // Dark Blue
	'#4B0082', // Indigo
	'#800000', // Maroon
	'#006400', // Dark Green
	'#8B4513', // Saddle Brown
	'#2F4F4F', // Dark Slate Gray
	'#8B0000', // Dark Red
	'#483D8B', // Dark Slate Blue
	'#2E8B57' // Sea Green
]
function handleColors() {
	const { subscribe, set, update } = writable(COLORS)

	function pick() {
		let allColors = [...get(colors)]

		let color = allColors.pop()

		if (!color) return COLORS[0]

		set(allColors)

		return color
	}

	function returnColor(color: string) {
		let allColors = [...get(colors)]

		if (allColors.length >= COLORS.length) return

		allColors.push(color)

		set(allColors)
	}

	function reset() {
		set(COLORS)
	}

	return {
		subscribe,
		pick,
		returnColor,
		reset
	}
}

export const colors = handleColors()
