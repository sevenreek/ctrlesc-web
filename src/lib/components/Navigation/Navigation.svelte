<script lang="ts">
	import type { Room } from '$lib/room';
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	export let rooms: Room[];

	const drawerStore = getDrawerStore();
	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav p-4">
	<ul>
		<li><a on:click={drawerClose} href="/" class="font-semibold">Dashboard</a></li>
		<hr />
		<h1 class="py-2 px-1 font-bold text-xs">Rooms</h1>
		{#each rooms as room}
			<li><a on:click={drawerClose} href="/rooms/{room.slug}">{room.name}</a></li>
		{/each}
		<hr />
		<h1 class="py-2 px-1 font-bold text-xs">Data</h1>
		<li><a on:click={drawerClose} href="/">Stats</a></li>
		<li><a on:click={drawerClose} href="/">Logs</a></li>
		<li><a on:click={drawerClose} href="/">Settings</a></li>
	</ul>
</nav>
