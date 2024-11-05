<script lang="ts">
	import { goto } from '$app/navigation'
	import { formatBytes } from '$lib/utils'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'
	// import { compressPdf } from '$lib/utils/compressPDF'

	onMount(() => {
		goto('/merge')
	})

	const result = writable<
		{
			file: File
			initialSize: number
			name: string
			compressedBlob: null | Blob
			newSize: number
			link: string
		}[]
	>([])

	let loading = $state(false)

	let files: FileList | undefined = $state()
	let doc: File[] = []

	$effect(() => {
		if (files) {
			for (const file of files) {
				console.log(`${file.name}: ${file.size} bytes`)
				doc.push(file)
			}
		}
	})

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

	function base64ToBlob(base64: string): Blob {
		const byteCharacters = atob(base64)
		const byteNumbers = new Array(byteCharacters.length)
		for (let i = 0; i < byteCharacters.length; i++) {
			byteNumbers[i] = byteCharacters.charCodeAt(i)
		}
		const byteArray = new Uint8Array(byteNumbers)
		return new Blob([byteArray], { type: 'application/pdf' })
	}

	// async function compress() {
	// 	if (!doc.length) return

	// 	console.log(formatBytes(doc[0].size))

	// 	// let file = doc
	// 	let file = await fileToBase64(doc[0])

	// 	if (typeof file !== 'string') return

	// 	// console.log(/^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/.test(file))

	// 	const response = await fetch('/compress', {
	// 		method: 'POST',
	// 		body: JSON.stringify({ file }),
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		}
	// 	})

	// 	const { compressedBase64 } = await response.json()

	// 	const blob = base64ToBlob(compressedBase64, 'application/pdf')

	// 	console.log(formatBytes(blob.size))

	// 	// const dataUrl = `data:application/pdf;base64,${compressedBase64}`;
	// 	//     const link = document.createElement('a');
	// 	//     link.href = dataUrl;
	// 	//     link.download = 'compressed.pdf';
	// 	//     link.click();
	// }

	async function compressMultiple() {
		if (!doc.length) return

		try {
			loading = true

			const res = await Promise.all(
				doc.map((file) =>
					fileToBase64(file).then((base64) =>
						fetch('/compress', {
							method: 'POST',
							body: JSON.stringify({
								file: base64,
								initialSize: file.size,
								name: slugify(file.name.split('.')[0])
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
						let compressedBlob = null
						let link = null
						if (d.compressedBase64) {
							compressedBlob = base64ToBlob(d.compressedBase64)
							link = `data:application/pdf;base64,${d.compressedBase64}`
						}

						return {
							...d,
							compressedBlob,
							newSize: compressedBlob?.size || d.initialSize,
							link
						}
					})
				)
			)

			loading = false

			result.set(data)
		} catch (error) {
			loading = false
			console.log(error)
		}

		// console.log(data)
	}

	function downloadCompressed(obj: Blob | string, name: string) {
		const link = document.createElement('a')

		link.href = obj instanceof Blob ? URL.createObjectURL(obj) : obj
		link.download = `compressed-${name}`
		// some browser needs the anchor to be in the doc
		document.body.append(link)
		link.click()
		link.remove()
	}

	function rowClass(oldSize: number, newSize: number) {
		let p = 100 - (newSize * 100) / oldSize
		return p > 50 ? 'text-[#009e4c]' : p <= 0 ? 'text-[#df270a]' : ''
	}
</script>

<div class="flex flex-col items-center mx-auto gap-8">
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
		<button class="btn btn-primary" onclick={compressMultiple}>Compress</button>
	</div>

	{#if loading}
		<span class="loading loading-spinner loading-lg mx-auto mt-8"></span>
	{/if}

	{#if $result.length}
		<div class="overflow-x-auto">
			<table class="table">
				<!-- head -->
				<thead class="sticky top-0 bg-base-100">
					<tr>
						<th></th>
						<th>Name</th>
						<th>Initial Size</th>
						<th>Compressed Size</th>
						<th>Reduced by %</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each $result as { name, initialSize, newSize, link }, i}
						<tr class={rowClass(initialSize, newSize)}>
							<th>{i + 1}</th>
							<td>{name}</td>
							<td>{formatBytes(initialSize)}</td>
							<td>{formatBytes(newSize)}</td>
							<td>{(100 - (newSize * 100) / initialSize).toFixed(1)}</td>
							<td>
								<button class="link link-sm" onclick={() => downloadCompressed(link, name)}>
									link
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
