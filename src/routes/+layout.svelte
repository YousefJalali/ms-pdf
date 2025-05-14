<script lang="ts">
	import '../app.css'
	import Alert from '$lib/ui/Alert.svelte'
	import { onMount } from 'svelte'
	import { locale, setLang, type Lang } from '$lib/i18n'
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
	<Alert />
</div>
