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
	'#2E8B57', // Sea Green
	'#000080', // Navy
	'#708090', // Slate Gray
	'#808000', // Olive
	'#556B2F', // Dark Olive Green
	'#B22222', // Firebrick
	'#5F9EA0', // Cadet Blue
	'#228B22', // Forest Green
	'#6A5ACD', // Slate Blue
	'#4682B4', // Steel Blue
	'#800080', // Purple
	'#D2691E', // Chocolate
	'#A52A2A', // Brown
	'#CD5C5C', // Indian Red
	'#FF4500', // Orange Red
	'#FF6347', // Tomato
	'#DAA520', // Goldenrod
	'#B8860B', // Dark Goldenrod
	'#FF8C00', // Dark Orange
	'#2F4F4F', // Dark Slate Gray
	'#DC143C' // Crimson
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
