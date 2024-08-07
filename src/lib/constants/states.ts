import { LINKS } from './tools'

export const states = {
	[LINKS['pdfToImage']]: {
		upload: {
			title: 'Convert Your PDFs to Images Effortlessly!',
			description:
				'Quickly transform your PDF files into high-quality images. Simply upload your documents below, and easily convert single pages or entire PDFs in just a few clicks!'
		},
		uploading: {
			title: 'Uploading Your PDFs...',
			description:
				'Your PDFs are being uploaded. Please wait a moment while we securely transfer your documents. Once the upload is complete, you will be able to convert them into high-quality JPG images.'
		},
		merged: {
			title: '🎉 Your PDFs Have Been Merged!',
			description:
				'	Your PDF files have been successfully combined into a single document. You can preview the merged PDF below.'
		},
		downloading: {
			title: '⏳ Preparing Your Download Link...',
			description:
				'Please wait a moment while we convert your PDF to images. This should only take a few seconds.'
		},
		downloaded: {
			title: 'Woohoo! Download Successful! 🎉',
			description:
				'Your images has been successfully downloaded. Thank you for using our service! If you have any other documents to convert, feel free to'
		}
	},
	[LINKS['merge']]: {
		upload: {
			title: 'Merge Your PDFs Seamlessly!',
			description:
				'Easily combine your PDF files into one cohesive document. Simply upload your files below. You can select multiple files at once for a quick and efficient merge!'
		},
		uploading: {
			title: 'Uploading Your PDFs...',
			description:
				'Your PDFs are being uploaded. Please wait a moment while we securely transfer your documents. Once the upload is complete, you will be able to merge them.'
		},
		merging: {
			title: 'Merging Your PDFs...',
			description:
				'Your PDF files are currently being combined into a single document. This may take a moment. Please wait while the process completes.'
		},
		merged: {
			title: '🎉 Your PDFs Have Been Merged!',
			description:
				'	Your PDF files have been successfully combined into a single document. You can preview the merged PDF below.'
		},
		downloading: {
			title: '⏳ Preparing Your Download Link...',
			description:
				'Please wait a moment while we generate the download link for your merged PDF. This should only take a few seconds.'
		},
		downloaded: {
			title: '✅ Download Complete!',
			description:
				'Your merged PDF has been successfully downloaded. Thank you for using our service! If you have any other documents to combine, feel free to merge more PDFs anytime.'
		}
	},
	[LINKS['split']]: {
		upload: {
			title: 'Split Your PDF Easily!',
			description:
				'Quickly separate your PDF into multiple files with ease. Simply upload your PDF below to get started. Choose to split all pages or specify custom page ranges to extract the sections you need. Get precise, organized, and easily manageable files in just a few clicks.'
		},
		uploading: {
			title: 'Uploading Your PDF...',
			description:
				'Your PDF is being uploaded. Please wait a moment while we securely transfer your document. Once the upload is complete, you will be able to split it.'
		},
		splitting: {
			title: 'Splitting Your PDF...',
			description:
				'Your PDF file is currently being split into multiple documents. This may take a moment. Please wait while the process completes.'
		},
		split: {
			title: '🎉 Your PDF Has Been Split!',
			description:
				'Your PDF file has been successfully split into multiple documents. You can preview the split PDFs below.'
		},
		downloading: {
			title: '⏳ Preparing Your Download Links...',
			description:
				'Please wait a moment while we generate the download links for your split PDFs. This should only take a few seconds.'
		},
		downloaded: {
			title: '✅ Download Complete!',
			description:
				'Your split PDFs have been successfully downloaded. Thank you for using our service! If you have any other documents to split, feel free to split more PDFs anytime.'
		}
	}
}
