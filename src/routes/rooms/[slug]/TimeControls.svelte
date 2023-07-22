<script lang="ts">
	import type { RoomDetails } from '$lib/Room';
	import 'iconify-icon';
	import { RoomState } from '$lib/Room';
	import { formatDuration, getElapsedSeconds } from '$lib/timeutil';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { success } from '$lib/Notifications';

	export let room: RoomDetails;

	const { slug, state, baseTime, name, stages, activeStage: activeStageIndex } = room;
	let { extraTime, startedOn, stoppedOn } = room;
	const activeStage = stages[activeStageIndex];

	let icon = '';
	let interval: ReturnType<typeof setInterval>;
	let elapsedTime: number | undefined = undefined;
	let elapsedTimeString = '';
	let totalTime = 0;
	let elapsedTimeProgressBarValue: number | undefined = elapsedTime;
	let remainingTime = 0;
	let remainingTimeString = '';
	let timeMeterColor = 'stroke-surface-900 dark:stroke-surface-50';
	$: {
		totalTime = extraTime + baseTime;
		elapsedTime = getElapsedSeconds(startedOn);
		elapsedTimeProgressBarValue =
			elapsedTime === undefined ? undefined : (elapsedTime / totalTime) * 100.0;
		elapsedTimeString = formatDuration(elapsedTime);
		remainingTime = totalTime - (elapsedTime ?? 0);
		remainingTimeString = formatDuration(remainingTime);
		if (extraTime) {
			remainingTimeString = remainingTimeString.concat(` (+${Math.floor(extraTime / 60)}m)`);
		}
		if (elapsedTime == null) {
		} else if (elapsedTime > totalTime) {
			timeMeterColor = 'stroke-error-600';
		} else if (elapsedTime > baseTime) {
			timeMeterColor = 'stroke-warning-600';
		}
		switch (state) {
			case RoomState.READY:
				icon = 'mingcute:door-fill';
				elapsedTimeString = 'Ready';
				break;
			case RoomState.ACTIVE:
				icon = 'mingcute:play-fill';
				break;
			case RoomState.PAUSED:
				icon = 'mingcute:pause-fill';
				break;
			case RoomState.FINISHED:
				icon = 'mingcute:flag-4-fill';
				elapsedTimeString = 'Done';
				remainingTimeString = '';
				elapsedTimeProgressBarValue = totalTime;
				break;
			case RoomState.STOPPED:
				icon = 'mingcute:stop-fill';
				break;
		}
		clearInterval(interval);
		interval = setInterval(() => {
			if (startedOn) {
				elapsedTime = getElapsedSeconds(startedOn);
			}
		}, 1000);
	}

	const debounce = (duration: number, callback: () => void) => {};
</script>

<div class="flex flex-col sm:flex-row gap-4">
	<div class="flex flex-row sm:flex-col justify-center gap-2">
		<button
			type="button"
			class="btn btn-sm variant-filled-success"
			on:click={() => {
				success(`Added 5 minutes of additional time in room ${name}.`);
				extraTime += 5 * 60;
			}}
		>
			<span>+5 min</span>
		</button>
		<button
			type="button"
			class="btn btn-sm variant-filled-error"
			on:click={() => {
				success(`Subtracted 5 minutes of time in room ${name}.`);
				extraTime -= 5 * 60;
			}}
		>
			<span>-5 min</span>
		</button>
	</div>
	<div class="grid items-center justify-items-center">
		<ProgressRadial
			class="col-span-full row-span-full"
			label="Time left"
			value={elapsedTimeProgressBarValue}
			width="w-20 md:w-40"
			meter={timeMeterColor}
		/>
		<iconify-icon class="text-3xl md:text-4xl col-span-full row-span-full" {icon} />
	</div>
	<div class="grid grid-cols-2 content-center gap-x-8 gap-y-4">
		<div>
			<div class="text-2xl">{elapsedTimeString}</div>
			<div class="uppercase text-2xs font-bold">Elapsed</div>
		</div>
		<div>
			<div class="text-2xl">{formatDuration(remainingTime)}</div>
			<div class="uppercase text-2xs font-bold">Left</div>
		</div>
		<div>
			<div class="text-sm">{formatDuration(baseTime)}</div>
			<div class="uppercase text-2xs font-bold">Base</div>
		</div>
		<div>
			<div class="text-sm">{formatDuration(extraTime)}</div>
			<div class="uppercase text-2xs font-bold">Extra</div>
		</div>
	</div>
</div>
