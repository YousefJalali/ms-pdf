<script lang="ts">
	export let showModal: boolean

	let dialog: HTMLDialogElement

	$: if (dialog && showModal) dialog.showModal()
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
	class="modal"
	bind:this={dialog}
	on:close={() => (showModal = false)}
	on:click|self={() => dialog.close()}
>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click|stopPropagation class="modal-box">
		<slot />
		<!-- svelte-ignore a11y-autofocus -->
		<button
			class="btn btn-sm btn-circle absolute right-2 top-2"
			autofocus
			on:click={() => dialog.close()}>✕</button
		>
	</div>
</dialog>
