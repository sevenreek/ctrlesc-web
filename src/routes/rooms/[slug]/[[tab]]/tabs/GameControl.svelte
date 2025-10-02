<script lang="ts">
	import StagePager from '$lib/components/StagePager/StagePager.svelte';
	import Stage from '$lib/components/StagePager/Stage.svelte';
	import type { Room } from '$lib/room';
	import TimeControls from '../TimeControls.svelte';

	let { room }: {room: Room} = $props();
</script>

<TimeControls {room} />
<StagePager class="w-full" activeStage={room.activeStage ?? 0}>
	{#each room.stages as stage (stage.slug)}
		<Stage>
			<span class="italic text-sm">{stage.description}</span>
			{#each stage.puzzles as puzzle (puzzle.slug)}
			{/each}
		</Stage>
	{/each}
</StagePager>
