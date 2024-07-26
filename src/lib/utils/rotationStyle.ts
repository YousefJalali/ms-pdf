import type { Page } from '$lib/types/merge'

export function rotationStyle(page: Page) {
	return page.rotationDegree
		? `transform: rotate(${page.rotationDegree}deg) scale(${page.rotationDegree + page.initialRotation === 90 || page.rotationDegree + page.initialRotation === 270 ? '0.8' : 1})`
		: ''
}
