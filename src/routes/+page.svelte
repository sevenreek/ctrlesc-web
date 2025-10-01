<script lang="ts">
	import type { PageData } from './$types';
	import RoomCard from '$lib/components/RoomCard/RoomCard.svelte';

	let { data}: {data: PageData} = $props();
</script>



<div class="container h-full mx-auto flex justify-center items-center p-12">
	<ul class="flex w-full flex-wrap flex-row justify-center gap-4">
		{#each data.rooms as room}
			<li class="w-96 xl:w-[49%] max-w-lg">
				<RoomCard {room} />
			</li>
		{/each}
	</ul>
</div>

