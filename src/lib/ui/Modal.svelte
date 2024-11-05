<script lang="ts">
	function closeHandler() {
		if (dialog) {
			dialog.close()
			onClose()
		}
	}

	interface Props {
		showModal: boolean
		children?: import('svelte').Snippet
		onClose: () => void
	}

	let { showModal = $bindable(), children, onClose }: Props = $props()

	let dialog: HTMLDialogElement | undefined = $state()

	$effect(() => {
		if (dialog && showModal) dialog.showModal()
	})
</script>

{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<dialog
		class="modal"
		bind:this={dialog}
		onclose={() => (showModal = false)}
		onclick={closeHandler}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={(e) => {
				e.stopPropagation()
			}}
			class="modal-box overflow-hidden transform-none"
		>
			<div class="sticky right-0 top-0 flex justify-end h-0 z-10">
				<button class="btn btn-sm btn-circle shadow" onclick={closeHandler}>✕</button>
			</div>
			{@render children?.()}
			<!-- svelte-ignore a11y_autofocus -->
		</div>
	</dialog>
{/if}
