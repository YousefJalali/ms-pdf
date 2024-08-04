import { CompressIcon, ConvertToImageIcon, MergeIcon, SplitIcon } from '../ui'

export const MAX_FILE_UPLOAD = 5
export const LINKS = {
	merge: '/merge',
	split: '/split',
	pdfToImage: '/pdf-to-image',
	compress: '/compress'
}
export const TOOLS = [
	{
		name: 'Merge PDF',
		link: LINKS.merge,
		icon: MergeIcon,
		description: 'Combine multiple PDF files into a single, organized document'
	},
	{
		name: 'Split PDF',
		link: LINKS.split,
		icon: SplitIcon,
		description: 'Easily separate a large PDF into individual pages'
	},
	{
		name: 'PDF to Image',
		link: LINKS.pdfToImage,
		icon: ConvertToImageIcon,
		description: 'Easily convert a large PDF into individual images'
	},
	{
		name: 'Compress PDF',
		link: LINKS.compress,
		icon: CompressIcon,
		description:
			'Effortlessly compress your PDF files to reduce their size without compromising quality'
	}
]
