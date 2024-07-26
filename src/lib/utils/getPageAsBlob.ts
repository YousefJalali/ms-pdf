import type { PDFPageProxy } from 'pdfjs-dist'

const LARGE = 600
const SMALL = 200

export async function getPageAsBlob(
	page: PDFPageProxy,
	pageId: string,
	type: 'small' | 'large' | number = 'small',
	srcOnly = false,
	format: 'jpeg' | 'webp' | 'png' = 'webp'
) {
	try {
		const scale =
			typeof type === 'number'
				? type
				: (type === 'small' ? SMALL : LARGE) / page.getViewport({ scale: 1 }).height

		const viewport = page.getViewport({ scale })

		// const canvas = document.getElementById(id) as HTMLCanvasElement
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		if (!context || !canvas) throw 'no context'

		canvas.height = viewport.height
		canvas.width = viewport.width

		const renderContext = {
			canvasContext: context,
			viewport: viewport
		}

		let renderTask = page.render(renderContext)

		await renderTask.promise

		const src = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, `image/${format}`, 1)
		)

		if (srcOnly) {
			return src
		}

		return {
			pageId,
			src,
			type
		}
	} catch (error) {
		console.log(error)
	}
}
