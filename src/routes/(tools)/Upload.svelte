<script lang="ts">
	import { MAX_FILE_UPLOAD } from '$lib/constants'
	import { alerts, docs } from '$lib/stores'

	export let component
	export let showPages = false

	let files: FileList | null
	const maxFileReached = () =>
		alerts.add('error', `The maximum number of files you can upload is ${MAX_FILE_UPLOAD}`)

	$: if (files) {
		let count = Object.keys($docs).length

		if (count < MAX_FILE_UPLOAD) {
			for (const file of files) {
				count++
				if (count > MAX_FILE_UPLOAD) {
					maxFileReached()
					break
				} else {
					docs.create(file, showPages)
				}
			}
			files = null
		} else {
			maxFileReached()
		}
	}
</script>

<svelte:component this={component} bind:files />
