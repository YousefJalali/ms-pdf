<script lang="ts">
	import { run, self, createBubbler, stopPropagation } from 'svelte/legacy';

	const bubble = createBubbler();
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function closeHandler() {
		dialog.close()
		dispatch('close')
	}

	interface Props {
		showModal: boolean;
		children?: import('svelte').Snippet;
	}

	let { showModal = $bindable(), children }: Props = $props();

	let dialog: HTMLDialogElement = $state()

	run(() => {
		if (dialog && showModal) dialog.showModal()
	});
</script>

{#if showModal}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
	<dialog
		class="modal"
		bind:this={dialog}
		onclose={() => (showModal = false)}
		onclick={self(closeHandler)}
	>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div onclick={stopPropagation(bubble('click'))} class="modal-box overflow-hidden transform-none">
			<div class="sticky right-0 top-0 flex justify-end h-0 z-10">
				<button class="btn btn-sm btn-circle shadow" onclick={closeHandler}>✕</button>
			</div>
			{@render children?.()}
			<!-- svelte-ignore a11y_autofocus -->
		</div>
	</dialog>
{/if}
