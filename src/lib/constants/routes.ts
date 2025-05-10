import { Image, Merge, Split } from 'lucide-svelte'

export type Route = {
	title: string
	label: string
	icon: typeof Merge
	variant: 'default' | 'ghost'
	href: string
}

export const routes: Route[] = [
	{
		title: 'Merge PDF',
		label: '128',
		icon: Merge,
		variant: 'default',
		href: '/merge'
	},
	{
		title: 'Split PDF',
		label: '9',
		icon: Split,
		variant: 'ghost',
		href: '/split'
	},
	{
		title: 'PDF to Image',
		label: '',
		icon: Image,
		variant: 'ghost',
		href: '/pdf-to-image'
	}
]
