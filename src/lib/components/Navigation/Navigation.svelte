<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';
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
		<li><a on:click={drawerClose} href="/rooms/room-1">Room #1</a></li>
		<li><a on:click={drawerClose} href="/rooms/room-2">Room #2</a></li>
		<li><a on:click={drawerClose} href="/rooms/room-3">Room #3</a></li>
		<hr />
		<h1 class="py-2 px-1 font-bold text-xs">Data</h1>
		<li><a on:click={drawerClose} href="/">Stats</a></li>
		<li><a on:click={drawerClose} href="/">Logs</a></li>
		<li><a on:click={drawerClose} href="/">Settings</a></li>
	</ul>
</nav>
