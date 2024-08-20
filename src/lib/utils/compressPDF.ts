import { exec } from 'child_process'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

const execPromise = promisify(exec)

const cwd = process.cwd()

export const compressPdf = async ({
	name,
	base64
}: {
	name: string
	base64: string
}): Promise<string> => {
	try {
		const tempFolder = path.join(cwd, 'temp')
		const hasTempFolder = existsSync(tempFolder)

		if (!hasTempFolder) {
			await fs.mkdir(tempFolder)
		}

		const originalFilePath = path.join(cwd, 'temp', `${name}_original.pdf`)
		const compressFilePath = path.join(cwd, 'temp', `${name}_compress.pdf`)

		await fs.writeFile(originalFilePath, base64, 'base64')

		let options = [
			'gs',
			'-sDEVICE=pdfwrite',
			`-dCompatibilityLevel=1.7`,
			// `-dCompatibilityLevel=${version}`,
			'-dPDFSETTINGS=/screen',
			// '-r150',
			'-dNOPAUSE',
			'-dQUIET',
			'-dBATCH',
			// '-dDetectDuplicateImages',
			// '-dCompressFonts=true',
			// '-sColorConversionStrategy=Gray', //convert to gray
			// '-dOverPrint=/simulate',
			// '-dPrinted=false',
			// '-dEmbedAllFonts=true',
			// '-dSubsetFonts=true',
			// '-dAutoRotatePages=/None',
			// '-dDownsampleColorImages=true',
			// '-dColorImageDownsampleType=/Bicubic',
			// '-dColorImageResolution=150',
			// '-dGrayImageDownsampleType=/Bicubic',
			// '-dGrayImageResolution=150',
			// '-dMonoImageDownsampleType=/Bicubic',
			// '-dMonoImageResolution=150',
			`-sOutputFile="${compressFilePath}" ${originalFilePath}`
		]

		await execPromise(`${options.join(' ')}`)

		const compressFileBase64 = await fs.readFile(compressFilePath, 'base64')

		await fs.unlink(originalFilePath)
		await fs.unlink(compressFilePath)

		return compressFileBase64
	} catch (error) {
		throw error
	}
}
