<script lang="ts">
	import type { PageData } from './$types';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import TimeProgressBar from './TimeProgressBar.svelte';
	export let data: PageData;
	$: console.log(data)
</script>


<div class="container h-full mx-auto flex justify-center items-center">
	<ul class="flex flex-wrap flex-row justify-center gap-4">
		{#each data.rooms as room}
			<li class="block card overflow-hidden w-72">
				<header>
					<img src={room.image_url} class="w-full aspect-[21/9]"/>

					<TimeProgressBar label="Time left" baseTime={room.base_time} extraTime={room.extraTime} startedOn={room.started_on} stoppedOn={room.stopped_on}  />
					<ProgressBar rounded="rounded-none" label="Progress" value={room.completion} max={room.max_completion} meter="bg-primary-50" />
				</header>
				<section class="p-4">
					<h2 class="text-2xl">{room.name}</h2>
				</section>
			</li>
		{/each}
	</ul>
</div>

