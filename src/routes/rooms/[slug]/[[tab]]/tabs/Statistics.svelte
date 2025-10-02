<script lang="ts" context="module">
	import type { RoomGameActive, RoomGameDiscriminated } from '$lib/room';
	function getCurrentStageDuration(room: RoomGameActive) {
		const lastStageCompletionTime = room.game.stageCompletions.at(-1)?.gametime ?? 0;
		let currentStageDuration =
			Date.now() -
			Date.parse(room.startTimestamp) -
			room.timeElapsedOnPause * 1000 -
			lastStageCompletionTime * 1000;
		return Math.round(currentStageDuration / 1000);
	}
</script>

<script lang="ts">
	import DeltaTimePlot from '$lib/components/DeltaTimePlot/DeltaTimePlot.svelte';
	import { onMount } from 'svelte';

	export let room: RoomGameDiscriminated;
	export let compareSegments: Record<string, number[]>;

	let sourceSegments: number[] = [];

	$: if (room.game !== null) {
		sourceSegments = room.game.stageCompletions.map((stageCompletion) => stageCompletion.duration);
		sourceSegments.push(getCurrentStageDuration(room));
	}

	onMount(() => {
		const interval = setInterval(() => {
			if (room.game == null) return;
			sourceSegments[sourceSegments.length - 1] = getCurrentStageDuration(room);
			sourceSegments = sourceSegments;
			console.log(sourceSegments);
		}, 1000);
		return () => clearInterval(interval);
	});
</script>

<DeltaTimePlot stages={room.stages} source={sourceSegments} compare={compareSegments} />
