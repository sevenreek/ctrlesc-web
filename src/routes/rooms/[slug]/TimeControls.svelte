<script lang="ts">
	import type { Room, TimerState } from '$lib/room';
	import 'iconify-icon';
	import { formatDuration, getElapsedSeconds } from '$lib/timeUtil';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { error, success } from '$lib/notifications';
	import { getCurrentRoomCompletion, getRoomMaxCompletion } from '$lib/api/roomUtil';
	import { requestAction, type RoomAction } from '$lib/api/rooms';

	export let room: Room;

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

	let ACTIONS = ROOM_STATE_MAPPING['ready'];
	let interval: ReturnType<typeof setInterval> | undefined = undefined;
	let elapsedTime: number | undefined = undefined;
	let elapsedTimeString = '';
	let totalTime = 0;
	let elapsedTimeProgressBarValue: number | undefined = elapsedTime;
	let remainingTime = 0;
	let remainingTimeString = '';
	let timeMeterColor = 'stroke-surface-900 dark:stroke-surface-50';
	let completionFraction: number = 0;
	$: ({ slug, state, baseTime, name, timeElapsedOnPause, extraTime, startTimestamp } = room);
	$: ACTIONS = ROOM_STATE_MAPPING[state as TimerState];
	$: {
		timeElapsedOnPause ??= 0;
		extraTime ??= 0;
		const maxCompletion = getRoomMaxCompletion(room);
		const completion = getCurrentRoomCompletion(room);
		let completionFraction = completion / maxCompletion;
		totalTime = extraTime + baseTime;
		elapsedTime =
			state === 'paused'
				? timeElapsedOnPause
				: (getElapsedSeconds(startTimestamp) ?? 0) + timeElapsedOnPause;
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
		clearInterval(interval);
		interval = setInterval(() => {
			if (startTimestamp) {
				elapsedTime = getElapsedSeconds(startTimestamp) ?? 0 + (timeElapsedOnPause as number);
			}
		}, 1000);
		completionFraction = completion ? completion / maxCompletion : 0;
	}
</script>

<div class="flex flex-col sm:flex-row gap-4 items-center">
	{#if ACTIONS.secondaryIcon}
		<button
			type="button"
			class="btn-icon btn-icon-md variant-filled-secondary"
			on:click={async () => {
				const successMessage = ACTIONS.secondaryActionSuccess;
				const errorMessage = ACTIONS.secondaryActionFailed;
				const response = await requestAction(fetch, slug, ACTIONS.secondaryAction);
				if (response.success) {
					success(`${name}: ${successMessage}`);
				} else {
					error(`${name}: ${errorMessage}`);
				}
			}}
		>
			<iconify-icon class="text-xl" icon={ACTIONS.secondaryIcon} />
		</button>
	{/if}
	<div class="flex flex-row sm:flex-col justify-center gap-2">
		<button
			type="button"
			class="btn btn-sm variant-filled-success"
			on:click={async () => {
				const response = await requestAction(fetch, slug, 'add', { minutes: 5 });
				if (response.success) {
					success(`${name}: Added 5 minutes of extra time.`);
				} else {
					error(`${name}: Failed to add 5 minutes of extra time. ${response.error}`);
				}
			}}
		>
			<span>+5 min</span>
		</button>
		<button
			type="button"
			class="btn btn-sm variant-filled-error"
			on:click={async () => {
				const response = await requestAction(fetch, slug, 'add', { minutes: -5 });
				if (response.success) {
					success(`${name}: Subtracted 5 minutes of extra time.`);
				} else {
					error(`${name}: Failed to subtract 5 minutes of extra time. ${response.error}`);
				}
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
			width="w-28 md:w-40"
			meter={timeMeterColor}
		/>
		<ProgressRadial
			class="col-span-full row-span-full"
			label="Completion"
			value={completionFraction * 100}
			width="w-24 md:w-32"
		/>
		<div class="relative w-full col-span-full row-span-full text-center">
			<button
				type="button"
				class="btn-icon relative aspect-square w-20 md:w-24 variant-filled-primary group"
				on:click={async () => {
					const successMessage = ACTIONS.primaryActionSuccess;
					const errorMessage = ACTIONS.primaryActionFailed;
					const response = await requestAction(fetch, slug, ACTIONS.primaryAction);
					if (response.success) {
						success(`${name}: ${successMessage}`);
					} else {
						error(`${name}: ${errorMessage}`);
					}
				}}
			>
				<div>
					<iconify-icon
						class="absolute block top-50% left-50% -translate-x-[50%] -translate-y-[50%] ml-auto mr-auto mt-auto text-2xl md:text-4xl transition-all group-hover:opacity-0 duration-300"
						icon={ACTIONS.primaryIcon}
					/>
					<iconify-icon
						class="absolute block top-50% left-50% -translate-x-[50%] -translate-y-[50%] text-2xl md:text-4xl opacity-0 transition-all group-hover:opacity-100 duration-300"
						icon={ACTIONS.primaryIconHover}
					/>
				</div>
			</button>
			<span class="block w-full absolute text-xs top-8 ml-20 sm:ml-0 sm:mt-16 md:mt-24 md:text-sm">
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
