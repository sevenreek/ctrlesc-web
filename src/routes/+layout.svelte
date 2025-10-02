<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fly } from 'svelte/transition';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import AppBar from '$lib/components/AppBar/AppBar.svelte';

	let { children, data }: {children: Snippet, data: LayoutData} = $props();
</script>

<div class="grid grid-rows-[auto_1fr_auto] h-screen w-full">
	<header class="sticky top-0 z-20">
		<AppBar/>
	</header>
	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr] h-screen w-full">
		<Sidebar.Provider class="w-full">
			<aside class="h-full">
				<Navigation rooms={data.rooms} />
			</aside>
		</Sidebar.Provider>
		<main class="w-full h-full">
			{@render children?.()}
		</main>
	</div>
	<!--
	<aside class="fixed right-4 bottom-4 flex flex-col gap-2 w-96">
		{#each $toasts as notification (notification.id)}
			<div in:fly={{ duration: 200 }} out:fly={{ duration: 200 }}>
				<Toast {notification} />
			</div>
		{/each}
	</aside>
	--->
</div>