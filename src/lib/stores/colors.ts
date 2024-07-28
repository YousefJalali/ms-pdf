import { get, writable } from 'svelte/store'

const COLORS = [
	'oklch(0.3 0.2 200)',
	'oklch(0.25 0.3 270)',
	'oklch(0.35 0.25 320)',
	'oklch(0.4 0.2 30)',
	'oklch(0.45 0.25 90)',
	'oklch(0.3 0.3 150)',
	'oklch(0.35 0.2 180)',
	'oklch(0.25 0.25 210)',
	'oklch(0.4 0.3 60)',
	'oklch(0.3 0.35 300)'
]
function handleColors() {
	const { subscribe, set, update } = writable(COLORS)

	function pick() {
		let allColors = [...get(colors)]

		let color = allColors.pop()

		if (!color) return 'red'

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
