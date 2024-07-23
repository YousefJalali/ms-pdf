import { getInputAsUint8Array } from '.'
import { PDFDocument } from 'pdf-lib'

export async function getPdf(file: File) {
	const src = await getInputAsUint8Array(file)
	return await PDFDocument.load(src, {
		ignoreEncryption: true
	})
}
