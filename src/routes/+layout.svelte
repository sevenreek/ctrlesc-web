<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { fly } from 'svelte/transition';
	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import AppBar from '$lib/components/AppBar/AppBar.svelte';
	import type { Snippet } from 'svelte';
	import type { LayoutData } from './$types';

	let { children, data }: {children: Snippet, data: LayoutData} = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<div class="grid grid-rows-[auto_1fr_auto] h-screen">
	<header class="sticky top-0 z-10">
		<AppBar/>
		<!-- App Bar -->
		<!--<AppBar>
				<div class="flex items-center">
					<div class="lg:hidden btn btn-sm mr-4">
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</div>
					<strong class="text-xl uppercase">
						<sup class="-mr-2">ctrl</sup>
						<span class="-mr-2">+</span>
						<sub>esc</sub>
					</strong>
				</div>
		</AppBar>
	-->
	</header>
	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr] h-screen">
		<aside class="h-full">
			<Navigation rooms={data.rooms} />
		</aside>
		<main>
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
