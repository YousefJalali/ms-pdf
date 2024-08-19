import { exec } from 'child_process'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

const execPromise = promisify(exec)

const cwd = process.cwd()

export const compressPdf = async (name: string, base64: string): Promise<string> => {
	try {
		const tempFolder = path.join(cwd, 'temp')
		const hasTempFolder = existsSync(tempFolder)

		if (!hasTempFolder) {
			await fs.mkdir(tempFolder)
		}

		const originalFilePath = path.join(cwd, 'temp', `${name}_original.pdf`)
		const compressFilePath = path.join(cwd, 'temp', `${name}_compress.pdf`)

		await fs.writeFile(originalFilePath, base64, 'base64')

		await execPromise(
			`gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.2 -r200 -dPrinted=false -dNOPAUSE -dQUIET -dBATCH -sOutputFile="${compressFilePath}" ${originalFilePath}`
		)
		// await execPromise(
		// 	`gs
		//   -sDEVICE=pdfwrite
		//   -dCompatibilityLevel=1.3
		//   -r200
		//   -dPrinted=false
		//   -dNOPAUSE
		//   -dQUIET
		//   -dBATCH
		//   -dPDFSETTINGS=/ebook
		//   -dEmbedAllFonts=true
		//   -dSubsetFonts=true
		//   -dAutoRotatePages=/None
		//   -dColorImageDownsampleType=/Bicubic
		//   -dColorImageResolution=150
		//   -dGrayImageDownsampleType=/Bicubic
		//   -dGrayImageResolution=150
		//   -dMonoImageDownsampleType=/Bicubic
		//   -dMonoImageResolution=150
		//   -sOutputFile="${compressFilePath}" ${originalFilePath}`
		// )

		// await execPromise(
		// 	`gs -sDEVICE=pdfwrite -dNOPAUSE -dBATCH -sOutputFile="${compressFilePath}" ${originalFilePath}`
		// )

		const compressFileBase64 = await fs.readFile(compressFilePath, 'base64')

		await fs.unlink(originalFilePath)
		await fs.unlink(compressFilePath)

		return compressFileBase64
	} catch (error) {
		throw error
	}
}
