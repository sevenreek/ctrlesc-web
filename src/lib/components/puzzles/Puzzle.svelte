<script lang="ts">
	import 'iconify-icon';
	import type { Puzzle } from '$lib/room';
	import type { UIComponentType } from '$lib/component';
	import DigitalState from './DigitalState.svelte';
	export let puzzle: Puzzle;
	const { component, state } = puzzle;
</script>

<section>
	{#if component.type === 'unaryDigitalState'}
		UnaryDigitalState
	{:else if component.type === 'digitalState'}
		<DigitalState {component} {state} name={puzzle.name} />
	{:else if component.type === 'sequence'}
		Sequence
	{:else if component.type === 'speechDetection'}
		SpeechDetection
	{/if}
</section>
