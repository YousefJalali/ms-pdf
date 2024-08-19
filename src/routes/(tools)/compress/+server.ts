import { compressPdf } from '$lib/utils/compressPDF.js'
import { json } from '@sveltejs/kit'

export async function POST({ request, cookies }) {
	const { file, initialSize, name } = await request.json()
	console.log(initialSize, name)
	// const data = fs.readFileSync('tests/two_pages.pdf', 'utf8')
	// const base64pdf = Buffer.from(data).toString('base64')

	// console.log(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(base64pdf))

	const compressedBase64 = await compressPdf(name, file)

	return json({ compressedBase64, initialSize, name }, { status: 201 })
}
