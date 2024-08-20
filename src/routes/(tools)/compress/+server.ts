import { compressPdf } from '$lib/utils/compressPDF.js'
import { json } from '@sveltejs/kit'

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function POST({ request, cookies }) {
	const { file, initialSize, name } = await request.json()

	// const data = fs.readFileSync('tests/two_pages.pdf', 'utf8')
	// const base64pdf = Buffer.from(data).toString('base64')

	// console.log(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(base64pdf))

	return Promise.race([
		compressPdf({ name, base64: file }).then((compressedBase64) =>
			json({ compressedBase64, initialSize, name }, { status: 201 })
		),
		wait(6000).then(() => {
			return json({ compressedBase64: null, initialSize, name }, { status: 201 })
			// throw new Error('Timeout after ' + 3000 + ' ms')
		})
	])
}
