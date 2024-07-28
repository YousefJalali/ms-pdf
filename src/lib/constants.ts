import { CompressIcon, ConvertToImageIcon, MergeIcon, SplitIcon } from './ui'

export const MAX_FILE_UPLOAD = 5
export const TOOLS = [
	{
		name: 'Merge PDF',
		link: '/merge',
		icon: MergeIcon,
		description:
			'Combine multiple PDF files into a single, organized document with our Merge Tool. Perfect for consolidating reports, presentations, or any other documents, this tool allows you to seamlessly join files, ensuring a smooth and efficient workflow.'
	},
	{
		name: 'Split PDF',
		link: '/split',
		icon: SplitIcon,
		description:
			'Easily separate a large PDF into individual pages or custom segments. Whether you need to extract a single page or divide a document into multiple sections.'
	},
	{
		name: 'PDF to Image',
		link: '/pdf-to-image',
		icon: ConvertToImageIcon,
		description:
			'Easily convert a large PDF into individual images (JPEG, PNG, WEBP...). Whether you need to extract a single page or convert an entire document into multiple high-quality images, our tool makes it simple and efficient.'
	},
	{
		name: 'Compress PDF',
		link: '/compress',
		icon: CompressIcon,
		description:
			'Effortlessly compress your PDF files to reduce their size without compromising quality. Whether you need to send a document via email or save storage space, our tool ensures your PDFs remain clear and professional while taking up less room.'
	}
]
