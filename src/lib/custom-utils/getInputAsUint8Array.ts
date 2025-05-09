export async function getInputAsUint8Array(input: any) {
	// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
	if (input instanceof Uint8Array) {
		return input
	}

	// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer
	if (
		input instanceof ArrayBuffer ||
		Object.prototype.toString.call(input) === '[object ArrayBuffer]'
	) {
		return new Uint8Array(input)
	}

	// see https://developer.mozilla.org/en-US/docs/Web/API/Blob
	if (typeof Blob !== 'undefined' && input instanceof Blob) {
		const aBuffer = await input.arrayBuffer()
		return new Uint8Array(aBuffer)
	}

	// see https://developer.mozilla.org/en-US/docs/Web/API/URL
	if (input instanceof URL) {
		if (typeof fetch === 'undefined') {
			throw new Error('fetch is not defined. You need to use a polyfill for this to work.')
		}
		const res = await fetch(input)
		const aBuffer = await res.arrayBuffer()
		return new Uint8Array(aBuffer)
	}

	// throw a meaningful error if input type is unknown or invalid
	const allowedTypes = ['Uint8Array', 'ArrayBuffer', 'File', 'Blob', 'URL']
	let errorMsg = `pdf-input must be of type ${allowedTypes.join(', ')}, a valid filename or url!`
	if (typeof input === 'string' || input instanceof String) {
		errorMsg += ` Input was "${input}" wich is not an existing file, nor a valid URL!`
	} else {
		errorMsg += ` Input was of type "${typeof input}" instead.`
	}
	throw new Error(errorMsg)
}
