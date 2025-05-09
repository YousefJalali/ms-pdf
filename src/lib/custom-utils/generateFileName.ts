export const generateFileName = (prefix: string) =>
	`${prefix}PDF-${new Date()
		.toLocaleString()
		.split(',')[0]
		.replaceAll('/', '')}-${new Date().toLocaleTimeString().split(' ')[0].replaceAll(':', '')}`
