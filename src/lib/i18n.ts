import { derived, get, writable } from 'svelte/store'
import { translations } from './constants'
import { goto } from '$app/navigation'
import { page } from '$app/stores'

export type Lang = keyof typeof translations

export const locale = writable<Lang>('en')
export const locales = Object.keys(translations)

function translate(locale: Lang, key: string, vars: any) {
	// Let's throw some errors if we're trying to use keys/locales that don't exist.
	// We could improve this by using Typescript and/or fallback values.
	if (!key) throw new Error('no key provided to $t()')
	if (!locale) throw new Error(`no translation for key "${key}"`)

	// Grab the translation from the translations object.
	let text: string = (translations as { [key: string]: { [key: string]: string } })[locale][key]

	if (!text) throw new Error(`no translation found for ${locale}.${key}`)

	// Replace any passed in variables in the translation string.
	Object.keys(vars).map((k) => {
		const regex = new RegExp(`{{${k}}}`, 'g')
		text = text.replace(regex, vars[k])
	})

	return text
}

export const t = derived(
	locale,
	($locale) =>
		(key: string, vars = {}) =>
			translate($locale, key, vars)
)

export function setLang(lang: Lang) {
	if (!translations[lang]) return null

	locale.set(lang)

	localStorage.setItem('lang', lang)

	document.documentElement.setAttribute('lang', lang)

	// set direction
	document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')

	//check if lang is in url
	const { pathname } = get(page).url
	const urlSegments = pathname.split('/')
	const firstSegment = urlSegments[1] as Lang

	if (!translations[firstSegment] && lang !== 'en') {
		goto(`/${lang}${pathname.startsWith('/') ? '' : '/'}${pathname}`)
	} else {
		urlSegments[1] = lang
		goto(urlSegments.join('/'))
	}
}

export const langNames = {
	en: {
		name: 'English',
		nativeName: 'English'
	},
	ar: {
		name: 'Arabic',
		nativeName: 'العربية'
	},
	fil: {
		name: 'Filipino',
		nativeName: 'Filipino'
	}
}
