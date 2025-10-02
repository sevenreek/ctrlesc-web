<script lang="ts">
	import type { Room } from '$lib/room';
	import LabelledProgressBar from '$lib/components/progress/LabelledProgressBar.svelte';
	import { getElapsedSeconds, formatDuration } from '$lib/timeUtil';
	import MingIcon from '../icons/MingIcon.svelte';
	import * as Card from "$lib/components/ui/card"

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

	let elapsedTime: number | undefined = $state(getElapsedSeconds(startedOn));
	let interval: ReturnType<typeof setInterval> | undefined = setInterval(() => {
		if (startedOn) {
			elapsedTime = getElapsedSeconds(startedOn);
		}
	}, 1000);
	$effect(() => {
		elapsedTime = getElapsedSeconds(startedOn);
		return () => clearInterval(interval);
	})
	type CardState = {
		icon: string;
		state: string;
		elapsedTime: string;
		totalTime: number;
		stage: string;
		elapsedTimeValue: number | null;
		remainingTime: string;
	};

	let card = $derived.by<CardState>(() => {
		let icon = "";
		let stateString = "";
		let elapsedTimeString = formatDuration(elapsedTime);
		let totalTime = baseTime + extraTime;
		let stageString = stage;
		let elapsedTimeProgressBarValue: number | null = elapsedTime !== undefined ? elapsedTime : null;
		let remainingTimeString = formatDuration(totalTime - (elapsedTime ?? 0))
		if (extraTime) {
			remainingTimeString = remainingTimeString.concat(` (+${Math.floor(extraTime / 60)}m)`);
		}
		switch (roomState) {
			case 'ready':
				icon = 'mingcute:door-fill';
				stateString = 'Ready';
				elapsedTimeString = '';
				stageString = 'Ready';
				elapsedTimeProgressBarValue = 0;
				break;
			case 'active':
				icon = 'mingcute:play-fill';
				stateString = 'Ongoing';
				break;
			case 'paused':
				icon = 'mingcute:pause-fill';
				stateString = 'Paused';
				break;
			case 'finished':
				icon = 'mingcute:flag-4-fill';
				stateString = 'Done';
				elapsedTimeString = '';
				remainingTimeString = '';
				elapsedTimeProgressBarValue = totalTime;
				stageString = 'Done';
				break;
			case 'stopped':
				icon = 'mingcute:stop-fill';
				stateString = 'Stopped';
				break;
		}
		return {
			icon,
			totalTime,
			state: stateString,
			elapsedTime: elapsedTimeString,
			stage: stageString,
			elapsedTimeValue: elapsedTimeProgressBarValue,
			remainingTime: remainingTimeString,
		}
	});
</script>

<Card.Root class="gap-0 py-0">
	<Card.Header class="px-0 gap-0">
		<a
			class="rounded-t-lg px-4 py-5 ease-out duration-200  flex flex-row-reverse items-center w-full hover:bg-card-clickable"
			href="/rooms/{slug}"
		>
			<MingIcon size="md" icon={card.icon} />
			<div class="grow">
				<h3 class="text-lg font-bold">
					{name}
				</h3>
				<div class="text-xs opacity-60">
					<span>{card.stage}</span>
				</div>
			</div>
		</a>
	</Card.Header>
	<hr/>
	<Card.Content class="flex flex-row p-6 gap-4 items-center">
		<div class="grow-[5]">
			<div>
				<LabelledProgressBar
					value={card.elapsedTimeValue}
					max={card.totalTime}
				>
					{#snippet left()}
						<span class="text-md">{card.elapsedTime}</span>
					{/snippet}
					{#snippet right()}
						<span class="text-md">{card.remainingTime}</span>
					{/snippet}
				</LabelledProgressBar>
				<span class="text-sm italic">Time left</span>
			</div>
			<div>
				<LabelledProgressBar
					class="mt-2"
					value={completion}
					max={maxCompletion}
				>
					{#snippet left()}
						<span class="text-md">
							{completion ? `${Math.floor((completion / maxCompletion) * 100)}%` : '0%'}
						</span>
					{/snippet}
				</LabelledProgressBar>
				<span class="text-sm italic">Progress</span>
			</div>
		</div>
	</Card.Content>
</Card.Root>
