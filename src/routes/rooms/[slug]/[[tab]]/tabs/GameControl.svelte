<script lang="ts">
	import DeltaTimePlot from '$lib/components/DeltaTimePlot/DeltaTimePlot.svelte';
	import StagePager from '$lib/components/StagePager/StagePager.svelte';
	import Stage from '$lib/components/StagePager/Stage.svelte';
	import Puzzle from '$lib/components/puzzles/Puzzle.svelte';
	import type { Room } from '$lib/room';
	import TimeControls from '../TimeControls.svelte';

	export let room: Room;
</script>

<TimeControls {room} />
<StagePager class="w-full" activeStage={room.activeStage ?? 0}>
	{#each room.stages as stage (stage.slug)}
		<Stage>
			<span class="italic text-sm">{stage.description}</span>
			{#each stage.puzzles as puzzle (puzzle.slug)}
				<Puzzle {puzzle} stageSlug={stage.slug} />
			{/each}
		</Stage>
	{/each}
</StagePager>
