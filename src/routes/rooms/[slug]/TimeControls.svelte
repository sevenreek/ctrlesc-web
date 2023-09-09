<script lang="ts">
	import type { RoomDetail } from '$lib/Room';
	import 'iconify-icon';
	import { formatDuration, getElapsedSeconds } from '$lib/timeUtil';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { success } from '$lib/notifications';
	import { getRoomMaxCompletion } from '$lib/api/roomUtil';

	export let room: RoomDetail;

	const { slug, state, baseTime, name, stages, activeStage: activeStageIndex, completion } = room;
	let { extraTime, startedOn, stoppedOn } = room;

	let icon = '';
	let interval: ReturnType<typeof setInterval>;
	let elapsedTime: number | undefined = undefined;
	let elapsedTimeString = '';
	let totalTime = 0;
	let elapsedTimeProgressBarValue: number | undefined = elapsedTime;
	let remainingTime = 0;
	let remainingTimeString = '';
	let timeMeterColor = 'stroke-surface-900 dark:stroke-surface-50';
	const maxCompletion = getRoomMaxCompletion(room);
	let completionFraction = completion ? completion / maxCompletion : 0;
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
			case 'ready':
				icon = 'mingcute:door-fill';
				elapsedTimeString = 'Ready';
				break;
			case 'active':
				icon = 'mingcute:play-fill';
				break;
			case 'paused':
				icon = 'mingcute:pause-fill';
				break;
			case 'finished':
				icon = 'mingcute:flag-4-fill';
				elapsedTimeString = 'Done';
				remainingTimeString = '';
				elapsedTimeProgressBarValue = totalTime;
				break;
			case 'stopped':
				icon = 'mingcute:stop-fill';
				break;
		}
		clearInterval(interval);
		interval = setInterval(() => {
			if (startedOn) {
				elapsedTime = getElapsedSeconds(startedOn);
			}
		}, 1000);
		completionFraction = completion ? completion / maxCompletion : 0;
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
		<ProgressRadial
			class="col-span-full row-span-full"
			label="Completion"
			value={completionFraction * 100}
			width="w-16 md:w-32"
		/>
		<div class="relative w-full col-span-full row-span-full text-center">
			<iconify-icon class="text-2xl md:text-4xl" {icon} />
			<span class="block w-full absolute text-xs -mt-2 md:mt-4 md:text-sm">
				{Math.round(completionFraction * 100)}%
			</span>
		</div>
	</div>
	<div class="grid grid-cols-2 content-center gap-x-8 gap-y-4">
		<div>
			<div class="text-2xl">{elapsedTimeString}</div>
			<div class="uppercase text-2xs font-bold">{elapsedTime ? 'Elapsed' : 'State'}</div>
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
