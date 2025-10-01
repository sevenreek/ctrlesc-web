<script lang="ts">
	import type { Room } from '$lib/room';
	import { Navigation } from '@skeletonlabs/skeleton-svelte';
	import MingIcon from '../icons/MingIcon.svelte';
	let {rooms}: {rooms: Room[]} = $props();

</script>

<Navigation.Rail expanded={true}>
	{#snippet header()}
		<Navigation.Tile href="/" labelExpanded="Dashboard">
			<MingIcon icon="home-2-fill" size="md"/>
		</Navigation.Tile>
	{/snippet}
	{#snippet tiles()}
	{#each rooms as room}
		<h2 class="w-full text-left pl-2 text-sm">Rooms</h2>
		<Navigation.Tile href="/rooms/{room.slug}" labelExpanded={room.name}></Navigation.Tile>
	{/each}
	{/snippet}
	
	{#snippet footer()}
		<h2 class="w-full text-left pl-2 text-sm">Data</h2>
		<hr/>
		<Navigation.Tile href="/" labelExpanded="Stats"></Navigation.Tile>
		<Navigation.Tile href="/" labelExpanded="Logs"></Navigation.Tile>
		<Navigation.Tile href="/" labelExpanded="Settings"></Navigation.Tile>
	{/snippet}
</Navigation.Rail>