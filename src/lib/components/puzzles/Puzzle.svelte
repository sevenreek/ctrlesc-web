<script lang="ts">
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
	import Icon from '@iconify/svelte';
	import * as Button from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	let {puzzle, stageSlug}: {puzzle: AnyPuzzle, stageSlug: string} = $props();

	let roomContext: RoomConfigContext = getContext(ROOM_CONTEXT);
	let roomStateContext: RoomStateContext = getContext(ROOM_STATE_CONTEXT);
	let stageContext: StageContext = getContext(STAGE_CONTEXT);

	let puzzleLoaded = $derived(roomStateContext.activeStage === stageContext.index);
	let skipAllowed = $derived(roomStateContext.state === 'active');
</script>

<Card.Root class="card flex flex-col max-w-xl min-w-sm grow variant-soft gap-4 py-4">
	<Card.Header class="flex flex-row justify-between items-center grow-0">
		<h4 class="text-md font-bold text-left">{puzzle.name}</h4>
		{#if puzzle.completed}
			<Button.Root disabled>
				<Icon icon="mingcute:check-circle-fill" class="mr-0" />
				<span>Completed</span>
			</Button.Root>
		{:else if !puzzleLoaded || !skipAllowed}
			<Button.Root disabled variant="ghost">
				<Icon icon="mingcute:close-circle-fill" class="mr-0" />
				<span>Inactive</span>
			</Button.Root>
		{:else if puzzle.completeOverrideEnabled}
			<Button.Root
				class="btn btn-sm variant-filled-primary"
				onclick={async () => {
					const response = await requestAction(fetch, roomContext.slug, 'skip', {
						stage: stageSlug,
						puzzle: puzzle.slug
					});
					if (response.success) {
						//success(`${roomContext.slug}: skipped ${name}.`);
					} else {
						//error(`${roomContext.slug}: failed to skip ${name}.`);
					}
				}}
			>
				<Icon icon="mingcute:skip-forward-fill" class="mr-2" />
				Skip
			</Button.Root>
		{/if}
	</Card.Header>
	<hr />
	<Card.Content
		class="flex flex-col align-center grow-1 justify-center h-full px-4 transition-all duration-75 {puzzle.completed
			? 'blur-sm hover:blur-none'
			: ''}"
	>
		{#if puzzle.type === 'DIGITAL_STATE'}
			<DigitalState {puzzle} />
		{:else if puzzle.type === 'SEQUENCE'}
			<Sequence {puzzle} />
		{:else if puzzle.type === 'SPEECH_DETECTION'}
			SpeechDetection
		{/if}
	</Card.Content>
</Card.Root>
