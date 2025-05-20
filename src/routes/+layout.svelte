<script lang="ts">
	import '../app.css'
	import { onMount } from 'svelte'
	import { locale, setLang, type Lang } from '$lib/i18n'
	import { alerts } from '$lib/stores'
	import * as Alert from '$lib/components/ui/alert/index.js'

	interface Props {
		children?: import('svelte').Snippet
	}

	let { children }: Props = $props()

	onMount(() => {
		const LangInLS = localStorage.getItem('lang') as Lang

		if (LangInLS && LangInLS !== $locale) setLang(LangInLS)
	})
</script>

<svelte:head>
	<meta name="google-site-verification" content="maUHEPNCAafwRrAAQo-ufXpX0pn_8GDOxfIeZEl4DYc" />
</svelte:head>

<div class="h-screen">
	{@render children?.()}

	{#if $alerts.length}
		<div class="fixed top-8 left-1/2 -translate-x-1/2 min-w-56 gap-2 flex flex-col-reverse">
			{#each $alerts as { Icon, title, message }}
				<Alert.Root variant="destructive">
					<Icon class="h-4 w-4" />
					<Alert.Title>{title}</Alert.Title>
					<Alert.Description>{message}</Alert.Description>
				</Alert.Root>
			{/each}
		</div>
	{/if}
</div>
