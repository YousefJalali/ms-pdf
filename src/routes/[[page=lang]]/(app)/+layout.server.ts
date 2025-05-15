import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ cookies }) => {
	let layout = cookies.get('PaneForge:layout')
	let collapsed = cookies.get('PaneForge:collapsed')

	if (layout) layout = JSON.parse(layout)
	if (collapsed) collapsed = JSON.parse(collapsed)

	return {
		layout,
		collapsed
	}
}
