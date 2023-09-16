<script lang="ts">
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch } from '@skeletonlabs/skeleton';
	import { initializeStores, getDrawerStore, Drawer } from '@skeletonlabs/skeleton';
	import { fly } from 'svelte/transition';

	import Navigation from '$lib/components/Navigation/Navigation.svelte';
	import Toast from '$lib/notifications/Toast.svelte';
	import { toasts } from '$lib/notifications';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	initializeStores();

	const drawerStore = getDrawerStore();

	function drawerOpen(): void {
		drawerStore.open({});
	}
</script>

<Drawer>
	<h2 class="p-4">Navigation</h2>
	<hr />
	<Navigation rooms={data.rooms} />
</Drawer>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<div class="flex items-center">
					<button class="lg:hidden btn btn-sm mr-4" on:click={drawerOpen}>
						<span>
							<svg viewBox="0 0 100 80" class="fill-token w-4 h-4">
								<rect width="100" height="20" />
								<rect y="30" width="100" height="20" />
								<rect y="60" width="100" height="20" />
							</svg>
						</span>
					</button>
					<strong class="text-xl uppercase">
						<sup class="-mr-2">ctrl</sup>
						<span class="-mr-2">+</span>
						<sub>esc</sub>
					</strong>
				</div>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<LightSwitch />
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		<Navigation rooms={data.rooms} />
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
	<aside class="fixed right-4 bottom-4 flex flex-col gap-2 w-96">
		{#each $toasts as notification (notification.id)}
			<div in:fly={{ duration: 200 }} out:fly={{ duration: 200 }}>
				<Toast {notification} />
			</div>
		{/each}
	</aside>
</AppShell>
