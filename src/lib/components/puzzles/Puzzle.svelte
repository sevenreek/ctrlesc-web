<script lang="ts">
	import 'iconify-icon';
	import type { AnyPuzzle } from '$lib/room';
	import DigitalState from './DigitalState.svelte';
	import Sequence from './Sequence.svelte';
	import { getContext } from 'svelte';
	import {
		ROOM_CONTEXT,
		ROOM_STATE_CONTEXT,
		STAGE_CONTEXT,
		requestAction,
		type RoomConfigContext,
		type RoomStateContext,
		type StageContext
	} from '$lib/api/rooms';
	import { error, success } from '$lib/notifications';
	import type { Writable } from 'svelte/store';
	export let puzzle: AnyPuzzle;
	export let stageSlug: string;

	let roomContext: RoomConfigContext = getContext(ROOM_CONTEXT);
	let roomStateContext: Writable<RoomStateContext> = getContext(ROOM_STATE_CONTEXT);
	let stageContext: StageContext = getContext(STAGE_CONTEXT);

	$: ({ name, type, completed, completeOverrideEnabled } = puzzle);
	$: puzzleLoaded = $roomStateContext.activeStage === stageContext.index;
	$: skipAllowed = $roomStateContext.state === 'active';
</script>

<section class="card flex flex-col h-96 max-w-xl variant-soft">
	<div class="flex flex-row justify-between items-center grow-0 py-4 px-6">
		<h4 class="text-md font-bold text-left">{name}</h4>
		{#if completed}
			<button class="btn btn-sm variant-filled-success" disabled>
				<iconify-icon icon="mingcute:check-circle-fill" class="mr-0" />
				<span>Completed</span>
			</button>
		{:else if !puzzleLoaded || !skipAllowed}
			<button class="btn btn-sm variant-ghost-surface" disabled>
				<iconify-icon icon="mingcute:close-circle-fill" class="mr-0" />
				<span>Inactive</span>
			</button>
		{:else if completeOverrideEnabled}
			<button
				class="btn btn-sm variant-filled-primary"
				on:click={async () => {
					const response = await requestAction(fetch, roomContext.slug, 'skip', {
						stage: stageSlug,
						puzzle: puzzle.slug
					});
					if (response.success) {
						success(`${name}: skipped ${puzzle.name}.`);
					} else {
						error(`${name}: failed to skip ${puzzle.name}.`);
					}
				}}
			>
				<iconify-icon icon="mingcute:skip-forward-fill" class="mr-2" />
				Skip
			</button>
		{/if}
	</div>
	<hr />
	<div
		class="flex flex-col align-center grow-1 justify-center h-full px-4 transition-all duration-75 {completed
			? 'blur-sm hover:blur-none'
			: ''}"
	>
		{#if type === 'digitalState'}
			<DigitalState {puzzle} />
		{:else if type === 'sequence'}
			<Sequence {puzzle} />
		{:else if type === 'speechDetection'}
			SpeechDetection
		{/if}
	</div>
</section>
