<script lang="ts">
	import 'iconify-icon';
	import type { Puzzle } from '$lib/room';
	import DigitalState from './DigitalState.svelte';
	import Sequence from './Sequence.svelte';
	export let puzzle: Puzzle;
	const { component, name, completed } = puzzle;
	const skipEnabled = component.completeOverrideEnabled;
</script>

<section class="card flex flex-col h-96 max-w-xl variant-soft">
	<div class="flex flex-row justify-between items-center grow-0 py-4 px-6">
		<h4 class="text-md font-bold text-left">{name}</h4>
		{#if completed}
			<button class="btn btn-sm variant-filled-success" disabled>
				<iconify-icon icon="mingcute:check-circle-fill" class="mr-2" />
				<span>Completed</span>
			</button>
		{:else if skipEnabled}
			<button class="btn btn-sm variant-filled-primary">Skip</button>
		{/if}
	</div>
	<hr />
	<div
		class="flex flex-col align-center grow-1 justify-center h-full px-4 transition-all duration-75 {completed
			? 'blur-sm hover:blur-none'
			: ''}"
	>
		{#if component.type === 'digitalState'}
			<DigitalState {puzzle} />
		{:else if component.type === 'sequence'}
			<Sequence {puzzle} />
		{:else if component.type === 'speechDetection'}
			SpeechDetection
		{/if}
	</div>
</section>
