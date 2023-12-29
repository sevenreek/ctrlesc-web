<script lang="ts">
	import 'iconify-icon';
	import type { AnyPuzzle } from '$lib/room';
	import DigitalState from './DigitalState.svelte';
	import Sequence from './Sequence.svelte';
	import { getContext } from 'svelte';
	import { ROOM_CONTEXT, requestAction, type RoomContext } from '$lib/api/rooms';
	import { error, success } from '$lib/notifications';
	export let puzzle: AnyPuzzle;
	export let stageSlug: string;

	let roomContext = getContext(ROOM_CONTEXT) as RoomContext;

	$: ({ name, type, completed, completeOverrideEnabled } = puzzle);
</script>

<section class="card flex flex-col h-96 max-w-xl variant-soft">
	<div class="flex flex-row justify-between items-center grow-0 py-4 px-6">
		<h4 class="text-md font-bold text-left">{name}</h4>
		{#if completed}
			<button class="btn btn-sm variant-filled-success" disabled>
				<iconify-icon icon="mingcute:check-circle-fill" class="mr-2" />
				<span>Completed</span>
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
