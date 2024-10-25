/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Montserrat'],
				body: ['Lato']
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				lofi: {
					...require('daisyui/src/theming/themes')['lofi'],
					primary: '#D50101'
				}
			},

			'business'
		]
	},
	darkMode: ['class', '[data-theme="business"]']
}
