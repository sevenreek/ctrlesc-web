<script lang="ts">
	import DeltaTimePlot from '$lib/components/DeltaTimePlot/DeltaTimePlot.svelte';
	import type { Room } from '$lib/room';

	export let room: Room;
	export let events: any[] = [];
	export let compareSegments: Record<string, number[]>;
	export let sourceSegments: number[];
</script>

<DeltaTimePlot stages={room.stages} source={[100, 300, 200, 450]} compare={compareSegments} />
