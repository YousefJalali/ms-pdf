<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function closeHandler() {
		dialog.close()
		dispatch('close')
	}

	export let showModal: boolean

	let dialog: HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="modal"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={closeHandler}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="modal-box overflow-y-scroll">
		<div class="sticky right-0 top-0 flex justify-end h-0">
			<button class="btn btn-sm btn-circle shadow" on:click={closeHandler}>✕</button>
		</div>
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
	</div>
</dialog>
