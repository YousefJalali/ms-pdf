<script lang="ts">
	import { docs } from '$lib/stores'
	import { formatBytes } from '$lib/utils'
	import { PDFDocument } from 'pdf-lib'
	import { writable } from 'svelte/store'
	// import { compressPdf } from '$lib/utils/compressPDF'

	let loading = false

	const result = writable([])

	function slugify(title: string) {
		return title
			.trim()
			.replace(/ +/g, '-')
			.toLowerCase()
			.replace(/[^a-z0-9-]/g, '')
	}

	function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => {
				if (reader.result) {
					const base64 = reader.result.toString().split(',')[1] // Remove the data URL part
					resolve(base64)
				} else {
					reject(new Error('Failed to read file'))
				}
			}
			reader.onerror = () => reject(new Error('File reading error'))
			reader.readAsDataURL(file)
		})
	}

	function base64ToBlob(base64: string, contentType: string): Blob {
		const byteCharacters = atob(base64)
		const byteNumbers = new Array(byteCharacters.length)
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i)
		}
		const byteArray = new Uint8Array(byteNumbers)
		return new Blob([byteArray], { type: contentType })
	}

	async function compress() {
		if (!doc.length) return

		console.log(formatBytes(doc[0].size))

		// let file = doc
		let file = await fileToBase64(doc[0])

		if (typeof file !== 'string') return

		// console.log(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(file))

		const response = await fetch('/compress', {
			method: 'POST',
			body: JSON.stringify({ file }),
			headers: {
				'Content-Type': 'application/json'
			}
		})

		const { compressedBase64 } = await response.json()

		const blob = base64ToBlob(compressedBase64, 'application/pdf')

		console.log(formatBytes(blob.size))

		// const dataUrl = `data:application/pdf;base64,${compressedBase64}`;
		//     const link = document.createElement('a');
		//     link.href = dataUrl;
		//     link.download = 'compressed.pdf';
		//     link.click();
	}

	async function compressMultiple() {
		if (!doc.length) return

		loading = true

		const res = await Promise.all(
			doc.map((d) =>
				fileToBase64(d).then((base64) =>
					fetch('/compress', {
						method: 'POST',
						body: JSON.stringify({
							file: base64,
							initialSize: d.size,
							name: slugify(d.name.split('.')[0])
						}),
						headers: {
							'Content-Type': 'application/json'
						}
					})
				)
			)
		)

		const data = await Promise.all(
			res.map((r) =>
				r.json().then((d) => {
					let compressedBlob = base64ToBlob(d.compressedBase64, 'application/pdf')
					return {
						...d,
						compressedBlob,
						newSize: compressedBlob.size
					}
				})
			)
		)

		loading = false

		result.set(data)

		// console.log(data)
	}

	let files: FileList
	let doc: File[] = []

	$: if (files) {
		console.log(files)

		for (const file of files) {
			console.log(`${file.name}: ${file.size} bytes`)
			doc.push(file)
		}
	}
</script>

<div class="flex flex-col mx-auto gap-8">
	<div class="w-fit mx-auto">
		<input
			class="file-input file-input-bordered w-full max-w-xs"
			bind:files
			id="many"
			multiple
			type="file"
			accept="application/pdf"
		/>

		<!-- <button class="btn" on:click={compress}>compress</button> -->
		<button class="btn" on:click={compressMultiple}>Compress</button>
	</div>

	{#if loading}
		<span class="loading loading-spinner loading-lg"></span>
	{/if}

	{#if $result.length}
		<div class="overflow-x-auto">
			<table class="table">
				<!-- head -->
				<thead>
					<tr>
						<th></th>
						<th>Name</th>
						<th>Initial Size</th>
						<th>New Size</th>
						<th>Reduced by %</th>
					</tr>
				</thead>
				<tbody>
					{#each $result as res, i}
						<tr>
							<th>{i + 1}</th>
							<td>{res.name}</td>
							<td>{formatBytes(res.initialSize)}</td>
							<td>{formatBytes(res.newSize)}</td>
							<td>{(100 - (res.newSize * 100) / res.initialSize).toFixed(1)} %</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
