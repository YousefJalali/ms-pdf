import type { Page } from '$lib/types'

export function rotationStyle(page: Page) {
	return page.rotationDegree
		? `transform: rotate(${page.rotationDegree}deg) scale(${page.rotationDegree === 90 || page.rotationDegree === 270 ? '0.8' : 1})`
		: ''
}
