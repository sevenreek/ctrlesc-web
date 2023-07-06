<script lang="ts">
	import type { PageData } from './$types';
	import RoomOverviewCard from './RoomOverviewCard.svelte';
	import 'iconify-icon';
	export let data: PageData;
	$: console.log(data);
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<ul class="flex flex-wrap flex-row justify-center gap-4">
		{#each data.rooms as room}
			<li>
				<RoomOverviewCard {room} />
			</li>
		{/each}
	</ul>
</div>
