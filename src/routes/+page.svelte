<script lang="ts">
	import type { PageData } from './$types';
	import RoomOverviewCard from './RoomOverviewCard.svelte';
	import 'iconify-icon';
	export let data: PageData;
</script>

<div class="container h-full mx-auto flex justify-center items-center p-12">
	<ul class="flex flex-wrap flex-row justify-center gap-4">
		{#each data.rooms as room}
			<li class="w-96 xl:w-[49%]">
				<RoomOverviewCard {room} />
			</li>
		{/each}
	</ul>
</div>
