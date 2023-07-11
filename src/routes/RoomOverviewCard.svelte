<script lang="ts">
	import { RoomState } from '$lib/Room';
	import type { RoomBase } from '$lib/Room';
	import 'iconify-icon';
	import LabelledProgressBar from '$lib/LabelledProgressBar.svelte';

	export let room: RoomBase;

	let interval: ReturnType<typeof setInterval>;
	let icon = '';
	let stateMessage = '';
	let elapsedTime: number | undefined = undefined;
	let elapsedTimeString = '';
	let elapsedTimeProgressBarValue: number | undefined = elapsedTime;
	let remainingTimeString = '';
	let timeMeterColor = 'bg-primary-600';
	const {
		extraTime,
		baseTime,
		startedOn,
		stoppedOn,
		state,
		completion,
		maxCompletion,
		name,
		slug
	} = room;

	function getElapsedSeconds(startedOnDate?: string | Date) {
		if (!startedOnDate) return undefined;
		return Math.floor((Date.now() - new Date(startedOnDate).getTime()) / 1000);
	}

	function formatDuration(durationInSeconds?: number) {
		if (durationInSeconds == null) return '';
		let sign = '';
		if (durationInSeconds < 0) {
			durationInSeconds = Math.abs(durationInSeconds);
			sign = '-';
		}
		const seconds = durationInSeconds % 60;
		const minutes = Math.floor(durationInSeconds / 60) % 60;
		const hours = Math.floor(durationInSeconds / 3600);
		const formattedSeconds = String(seconds).padStart(2, '0');
		const formattedMinutes = hours
			? String(minutes).padStart(2, '0').concat(':')
			: String(minutes).concat(':');
		const formattedHours = hours ? String(hours).concat(':') : '';
		return `${sign}${formattedHours}${formattedMinutes}${formattedSeconds}`;
	}

	$: totalTime = extraTime + baseTime;
	$: elapsedTime = getElapsedSeconds(startedOn);
	$: {
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
			case RoomState.READY:
				icon = 'mingcute:door-fill';
				stateMessage = 'READY';
				elapsedTimeString = 'Ready';
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
				elapsedTimeString = 'Done';
				remainingTimeString = '';
				elapsedTimeProgressBarValue = totalTime;
				break;
			case RoomState.STOPPED:
				icon = 'mingcute:stop-fill';
				stateMessage = 'STOPPED';
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
					<iconify-icon class="text-md text-error-500" icon="mingcute:alert-octagon-fill" />
				</h3>
				<div class="text-xs opacity-60">
					<span>Collecting bottlecaps</span>
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
				leftText={elapsedTimeString}
				rightText={remainingTimeString}
				meter={timeMeterColor}
			/>
			<LabelledProgressBar
				class="mt-3"
				label="Progress"
				value={completion}
				max={maxCompletion}
				leftText={`${Math.floor((completion / maxCompletion) * 100)}%`}
				meter="bg-secondary-600"
			/>
		</div>
		<div class="grow-[1] flex flex-col items-end">
			<span class="text-md">16:45</span>
			<span class="uppercase text-2xs font-bold">END</span>
		</div>
	</section>
</div>
