/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontFamily: {
				heading: ['Montserrat', 'system-ui'],
				body: ['Lato', 'system-ui']
			}
		}
	},
	plugins: [require('@tailwindcss/typography'), require('daisyui')],
	daisyui: {
		themes: [
			{
				lofi: {
					...require('daisyui/src/theming/themes')['lofi'],
					primary: '#D50101',
					'base-200': '#FBFAFA',
					'base-300': '#EEEEF1',
					// neutral: '#290202'
					'--rounded-box': '0.5rem',
					'--rounded-btn': '0.5rem'
				}
			},

			'business'
		]
	},
	darkMode: ['class', '[data-theme="business"]']
}
