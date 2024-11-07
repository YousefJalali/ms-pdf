import { translations } from '$lib/constants'
import type { ParamMatcher } from '@sveltejs/kit'

export const match = ((param: string): param is keyof typeof translations => {
	return Object.keys(translations).includes(param)
}) satisfies ParamMatcher
