<script lang="ts">
	import type { Room } from '$lib/room';
	import LabelledProgressBar from '$lib/components/progress/LabelledProgressBar.svelte';
	import { getElapsedSeconds, formatDuration } from '$lib/timeUtil';
	import MingIcon from '../icons/MingIcon.svelte';

	let {room}: {room: Room} = $props();
	const {
		extraTime,
		baseTime,
		startedOn,
		stoppedOn,
		state: roomState,
		completion,
		maxCompletion,
		name,
		slug,
		stage
	} = $derived(room);

	let interval: ReturnType<typeof setInterval> | undefined = $state(undefined);
	let icon = $state('');
	let stateMessage = $state('');
	let elapsedTime: number | undefined = $state(undefined);
	let elapsedTimeString = $state('');
	let elapsedTimeProgressBarValue: number | undefined = $state(elapsedTime);
	let remainingTimeString = $state('');
	let timeMeterColor = $state('bg-primary-600');
	let totalTime = $state(0);
    let stageString = $state(stage);

	$effect(() => {
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
		switch (roomState) {
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
);
</script>

<div class="card preset-filled-surface-100-900 overflow-hidden">
	<header>
		<a
			class="px-4 py-4 ease-out duration-200 hover:bg-surface-700 flex flex-row-reverse items-center w-full"
			href="/rooms/{slug}"
		>
			<MingIcon size="md" {icon} />
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
	<hr/>
	<section class="flex flex-row p-6 gap-4 items-center">
		<div class="grow-[5]">
			<LabelledProgressBar
				labelText="Time left"
				value={elapsedTimeProgressBarValue}
				max={totalTime}
				meter={timeMeterColor}
			>
                {#snippet left()}
                    <span class="text-sm">{elapsedTimeString}</span>
                {/snippet}
                {#snippet right()}
                    <span class="text-sm">{remainingTimeString}</span>
                {/snippet}
			</LabelledProgressBar>
			<LabelledProgressBar
				class="mt-2"
				labelText="Progress"
				value={completion}
				max={maxCompletion}
				meter="bg-secondary-600"
			>
                {#snippet left()}
                    <span class="text-sm">
                        {completion ? `${Math.floor((completion / maxCompletion) * 100)}%` : '0%'}
                    </span>
                {/snippet}
			</LabelledProgressBar>
		</div>
		<div class="grow-[1] flex flex-col items-end">
			<span class="text-md">16:45</span>
			<span class="uppercase text-2xs font-bold">END</span>
		</div>
	</section>
</div>
