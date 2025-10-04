<script lang="ts">
	import type { Room, TimerState } from '$lib/room';
	import { formatDuration, getElapsedSeconds } from '$lib/timeUtil';
	import RadialProgress from '$lib/components/progress/RadialProgress.svelte';
	import { getCurrentRoomCompletion, getRoomMaxCompletion } from '$lib/api/roomUtil';
	import { requestAction, type RoomAction } from '$lib/api/rooms';
	import * as Button from "$lib/components/ui/button"
	import Icon from "@iconify/svelte"

	let {room, class: classes}: {room: Room, class: string} = $props();

	function success(s: string) {
		console.warn("Would raise success toast")
	}
	function error(s: string) {
		console.warn("Would raise error toast")
	}

	const ROOM_STATE_MAPPING = {
		ready: {
			primaryIcon: 'mingcute:door-fill',
			primaryIconHover: 'mingcute:play-fill',
			secondaryIcon: '',
			primaryAction: 'start' as RoomAction,
			primaryActionSuccess: 'started.',
			primaryActionFailed: 'failed to start.',
			secondaryAction: 'stop' as RoomAction,
			secondaryActionSuccess: 'stopped.',
			secondaryActionFailed: 'failed to stop.'
		},
		active: {
			primaryIcon: 'mingcute:play-fill',
			primaryIconHover: 'mingcute:pause-fill',
			secondaryIcon: 'mingcute:stop-fill',
			primaryAction: 'pause' as RoomAction,
			primaryActionSuccess: 'paused.',
			primaryActionFailed: 'failed to pause.',
			secondaryAction: 'stop' as RoomAction,
			secondaryActionSuccess: 'stopped.',
			secondaryActionFailed: 'failed to stop.'
		},
		paused: {
			primaryIcon: 'mingcute:pause-fill',
			primaryIconHover: 'mingcute:play-fill',
			secondaryIcon: 'mingcute:stop-fill',
			primaryAction: 'start' as RoomAction,
			primaryActionSuccess: 'resumed.',
			primaryActionFailed: 'failed to resume.',
			secondaryAction: 'stop' as RoomAction,
			secondaryActionSuccess: 'stopped.',
			secondaryActionFailed: 'failed to stop.'
		},
		finished: {
			primaryIcon: 'mingcute:flag-4-fill',
			primaryIconHover: 'mingcute:refresh-1-fill',
			secondaryIcon: 'mingcute:bug-fill',
			primaryAction: 'reset' as RoomAction,
			primaryActionSuccess: 'reset.',
			primaryActionFailed: 'failed to reset.',
			secondaryAction: 'debug' as RoomAction,
			secondaryActionSuccess: 'entered debug mode.',
			secondaryActionFailed: 'failed to start debug mode.'
		},
		stopped: {
			primaryIcon: 'mingcute:stop-fill',
			primaryIconHover: 'mingcute:refresh-1-fill',
			secondaryIcon: 'mingcute:bug-fill',
			primaryAction: 'reset' as RoomAction,
			primaryActionSuccess: 'reset.',
			primaryActionFailed: 'failed to reset.',
			secondaryAction: 'debug' as RoomAction,
			secondaryActionSuccess: 'entered debug mode.',
			secondaryActionFailed: 'failed to start debug mode.'
		}
	};

	let interval: ReturnType<typeof setInterval> | undefined = undefined;
	function calculateElapsedTime(room: Room) {
		return (getElapsedSeconds(room.startTimestamp) ?? 0) - room.timeElapsedOnPause;
	}
	let elapsedTime = $state<number | undefined>(calculateElapsedTime(room));
	let totalTime = $derived(room.extraTime + room.baseTime);
	let elapsedTimeProgressBarValue: number = $derived.by(() => {
		if(elapsedTime === undefined) {
			return 0
		} else if (elapsedTime <= totalTime) {
			console.log(elapsedTime, totalTime);
			return (elapsedTime / totalTime) * 100.0;
		} else {
			return 100;
		}
	});
	let remainingTime = $derived(totalTime - (elapsedTime ?? 0));
	let remainingTimeString = $derived(
		room.extraTime ? `${formatDuration(remainingTime)} (+${Math.floor(room.extraTime / 60)}m)` : formatDuration(remainingTime)
	);
	let timeMeterColor = 'stroke-surface-900 dark:stroke-surface-50';
	const maxCompletion = getRoomMaxCompletion(room);
	const completion = $derived(getCurrentRoomCompletion(room));
	let completionFraction = $derived(completion / maxCompletion);
	const ACTIONS = $derived(ROOM_STATE_MAPPING[room.state as TimerState]);
	$effect(() => {
		interval = setInterval(() => {
			if(room.state === "active") {
				elapsedTime = calculateElapsedTime(room);
			}
		}, 1000);
		return () => clearInterval(interval);
	})
</script>

<div class="flex flex-col sm:flex-row gap-4 items-center {classes}">
	{#if ACTIONS.secondaryIcon}
		<Button.Root
			variant="outline"
			size="icon"
			class="rounded-full px-2"
			onclick={async () => {
				const successMessage = ACTIONS.secondaryActionSuccess;
				const errorMessage = ACTIONS.secondaryActionFailed;
				const response = await requestAction(fetch, room.slug, ACTIONS.secondaryAction);
				if (response.success) {
					success(`${room.name}: ${successMessage}`);
				} else {
					error(`${room.name}: ${errorMessage}`);
				}
			}}
		>
			<Icon
				class="text-2xl md:text-4xl transition-all group-hover:opacity-0 duration-300"
				icon={ACTIONS.secondaryIcon}
			/>
		</Button.Root>
	{/if}
	<div class="flex flex-row sm:flex-col justify-center gap-2">
		<Button.Root
			variant="outline"
			onclick={async () => {
				const response = await requestAction(fetch, room.slug, 'add', { minutes: 5 });
				if (response.success) {
					success(`${room.name}: Added 5 minutes of extra time.`);
				} else {
					error(`${room.name}: Failed to add 5 minutes of extra time. ${response.error}`);
				}
			}}
		>
			<span>+5 min</span>
		</Button.Root>
		<Button.Root
			variant="outline"
			onclick={async () => {
				const response = await requestAction(fetch, room.slug, 'add', { minutes: -5 });
				if (response.success) {
					success(`${room.name}: Subtracted 5 minutes of extra time.`);
				} else {
					error(`${room.name}: Failed to subtract 5 minutes of extra time. ${response.error}`);
				}
			}}
		>
			<span>-5 min</span>
		</Button.Root>
	</div>
	<div class="grid items-center justify-items-center">
		<RadialProgress
			class="col-span-full row-span-full"
			value={elapsedTimeProgressBarValue}
			size={140}
			strokeWidth={10}
		/>
		<RadialProgress
			class="col-span-full row-span-full"
			value={completionFraction * 100}
			size={90}
			strokeWidth={10}
		/>
		<div class="flex items-center justify-center relative w-full col-span-full row-span-full text-center">
			<Button.Root
				class="group absolute rounded-full px-2"
				variant="outline"
				size="icon"
				onclick={async () => {
					const successMessage = ACTIONS.primaryActionSuccess;
					const errorMessage = ACTIONS.primaryActionFailed;
					const response = await requestAction(fetch, room.slug, ACTIONS.primaryAction);
					if (response.success) {
						success(`${room.name}: ${successMessage}`);
					} else {
						error(`${room.name}: ${errorMessage}`);
					}
				}}
			>
				<div class="grid grid-cols-1 grid-rows-1">
					<Icon
						class="row-span-full col-span-full text-2xl md:text-4xl transition-all group-hover:opacity-0 duration-300"
						icon={ACTIONS.primaryIcon}
					/>
					<Icon
						class="row-span-full col-span-full text-2xl md:text-4xl opacity-0 transition-all group-hover:opacity-100 duration-300"
						icon={ACTIONS.primaryIconHover}
					/>
				</div>
			</Button.Root>
		</div>
	</div>
	<div class="grid grid-cols-2 content-center gap-x-8 gap-y-4">
		<div>
			<div class="text-2xl">{formatDuration(elapsedTime)}</div>
			<div class="uppercase text-2xs font-bold">{elapsedTime ? 'Elapsed' : 'State'}</div>
		</div>
		<div>
			<div class="text-2xl">{formatDuration(remainingTime)}</div>
			<div class="uppercase text-2xs font-bold">Left</div>
		</div>
		<div>
			<div class="text-sm">{formatDuration(room.baseTime)}</div>
			<div class="uppercase text-2xs font-bold">Base</div>
		</div>
		<div>
			<div class="text-sm">{formatDuration(room.extraTime)}</div>
			<div class="uppercase text-2xs font-bold">Extra</div>
		</div>
	</div>
</div>
