<script lang="ts">
	import StagePager from '$lib/components/StagePager/StagePager.svelte';
	import Stage from '$lib/components/StagePager/Stage.svelte';
	import type { Room } from '$lib/room';
	import TimeControls from '$lib/components/time/TimeControls.svelte';
	import Puzzle from '$lib/components/puzzles/Puzzle.svelte';

	let { room }: {room: Room} = $props();
</script>

<TimeControls {room} />
<StagePager class="w-full" activeStage={room.activeStage ?? 0}>
	{#each room.stages as stage (stage.slug)}
		<Stage>
			<span class="italic text-sm">{stage.description}</span>
			<div class="grid grid-cols-1 xl:grid-cols-2 justify-items-center">
			{#each stage.puzzles as puzzle (puzzle.slug)}
				<Puzzle {puzzle} stageSlug={stage.slug}/>
			{/each}
			</div>
		</Stage>
	{/each}
</StagePager>
