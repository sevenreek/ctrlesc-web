<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import TimeProgressBar from './TimeProgressBar.svelte';
	import { RoomState } from '$lib/Room';
	import type { RoomBase } from '$lib/Room';
	import 'iconify-icon';
	export let room: RoomBase;
	let icon = '';
	let stateMessage = '';
	$: console.log(room);
	$: {
		switch (room.state) {
			case RoomState.READY:
				icon = 'mingcute:door-fill';
				stateMessage = 'READY';
				break;
			case RoomState.ACTIVE:
				icon = 'mingcute:play-fill';
				stateMessage = 'ONGOING';
				break;
			case RoomState.PAUSED:
				icon = 'mingcute:pause-fill';
				stateMessage = 'PAUSED';
				break;
			case RoomState.FINISHED:
				icon = 'mingcute:flag-4-fill';
				stateMessage = 'DONE';
				break;
			case RoomState.STOPPED:
				icon = 'mingcute:stop-fill';
				stateMessage = 'STOPPED';
				break;
		}
	}
</script>

<div class="block card overflow-hidden w-72">
	<header />
	<section>
		<div class="px-1 flex flex-row items-center justify-between">
			<span class="text-sm">0:40</span>
			<span class="text-sm">1:20</span>
		</div>
		<TimeProgressBar
			label="Time left"
			baseTime={room.base_time}
			extraTime={room.extra_time}
			startedOn={room.started_on}
			stoppedOn={room.stopped_on}
		/>
		<ProgressBar
			rounded="rounded-none"
			label="Progress"
			value={room.completion}
			max={room.max_completion}
			meter="bg-secondary-600"
		/>
	</section>
	<footer class="p-2">
		<div class="flex flex-row-reverse items-center w-full">
			<iconify-icon class="text-xl" {icon} />
			<span class="text-xs uppercase">{stateMessage}</span>
			<div class="text-md font-semibold grow">{room.name}</div>
		</div>
	</footer>
</div>
