<script lang="ts">
	import type { RoomOverview } from '$lib/Room';
	import 'iconify-icon';
	import LabelledProgressBar from '$lib/LabelledProgressBar.svelte';
	import { getElapsedSeconds, formatDuration } from '$lib/timeUtil';

	export let room: RoomOverview;

	let interval: ReturnType<typeof setInterval>;
	let icon = '';
	let stateMessage = '';
	let elapsedTime: number | undefined = undefined;
	let elapsedTimeString = '';
	let elapsedTimeProgressBarValue: number | undefined = elapsedTime;
	let remainingTimeString = '';
	let timeMeterColor = 'bg-primary-600';
	let totalTime = 0;
	const {
		extraTime,
		baseTime,
		startedOn,
		stoppedOn,
		state,
		completion,
		maxCompletion,
		name,
		slug,
		stage
	} = room;
	let stageString = stage;

	$: {
		totalTime = extraTime + baseTime;
		elapsedTime = getElapsedSeconds(startedOn);
		elapsedTimeProgressBarValue = elapsedTime;
		elapsedTimeString = formatDuration(elapsedTime);
		remainingTimeString = formatDuration(totalTime - (elapsedTime ?? 0));
		if (extraTime) {
			remainingTimeString = remainingTimeString.concat(` (+${Math.floor(extraTime / 60)}m)`);
		}
		if (elapsedTime == null) {
			timeMeterColor = 'bg-primary-600';
		} else if (elapsedTime > totalTime) {
			timeMeterColor = 'bg-error-600';
		} else if (elapsedTime > baseTime) {
			timeMeterColor = 'bg-warning-600';
		}
		switch (state) {
			case 'ready':
				icon = 'mingcute:door-fill';
				stateMessage = 'Ready';
				elapsedTimeString = '';
				stageString = 'Ready';
				elapsedTimeProgressBarValue = 0;
				break;
			case 'active':
				icon = 'mingcute:play-fill';
				stateMessage = 'Ongoing';
				break;
			case 'paused':
				icon = 'mingcute:pause-fill';
				stateMessage = 'Paused';
				break;
			case 'finished':
				icon = 'mingcute:flag-4-fill';
				stateMessage = 'Done';
				elapsedTimeString = '';
				remainingTimeString = '';
				elapsedTimeProgressBarValue = totalTime;
				stageString = 'Done';
				break;
			case 'stopped':
				icon = 'mingcute:stop-fill';
				stateMessage = 'Stopped';
				break;
		}
		clearInterval(interval);
		interval = setInterval(() => {
			if (startedOn) {
				elapsedTime = getElapsedSeconds(startedOn);
			}
		}, 1000);
	}
</script>

<div class="block card overflow-hidden">
	<header>
		<a
			class="px-4 py-4 ease-out duration-200 hover:bg-surface-700 flex flex-row-reverse items-center w-full"
			href="/rooms/{slug}"
		>
			<iconify-icon class="text-xl" {icon} />
			<div class="grow">
				<h3 class="text-lg font-bold">
					{name}
				</h3>
				<div class="text-xs opacity-60">
					<span>{stageString}</span>
				</div>
			</div>
		</a>
	</header>
	<hr />
	<section class="flex flex-row p-6 gap-4 items-center">
		<div class="grow-[5]">
			<LabelledProgressBar
				label="Time left"
				value={elapsedTimeProgressBarValue}
				max={totalTime}
				meter={timeMeterColor}
			>
				<span class="text-sm" slot="left">{elapsedTimeString}</span>
				<span class="text-sm" slot="right">{remainingTimeString}</span>
			</LabelledProgressBar>
			<LabelledProgressBar
				class="mt-2"
				label="Progress"
				value={completion}
				max={maxCompletion}
				meter="bg-secondary-600"
			>
				<span class="text-sm" slot="left">
					{completion ? `${Math.floor((completion / maxCompletion) * 100)}%` : '0%'}
				</span>
			</LabelledProgressBar>
		</div>
		<div class="grow-[1] flex flex-col items-end">
			<span class="text-md">16:45</span>
			<span class="uppercase text-2xs font-bold">END</span>
		</div>
	</section>
</div>
