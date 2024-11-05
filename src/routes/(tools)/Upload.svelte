<script lang="ts">
	import { MAX_FILE_UPLOAD } from '$lib/constants'
	import { alerts, docs } from '$lib/stores'

	interface Props {
		component: any
		showPages?: boolean
	}

	let { component, showPages = false }: Props = $props()

	let files: FileList | null | undefined = $state()
	const maxFileReached = () =>
		alerts.add('error', `The maximum number of files you can upload is ${MAX_FILE_UPLOAD}`)

	$effect(() => {
		if (files) {
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
	})

	const SvelteComponent = $derived(component)
</script>

<SvelteComponent bind:files />
