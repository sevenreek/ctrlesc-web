<script lang="ts">
	import 'iconify-icon';
	import type { Puzzle } from '$lib/room';
	import type { UIComponentType } from '$lib/component';
	import DigitalState from './DigitalState.svelte';
	import UnaryDigitalState from './UnaryDigitalState.svelte';
	export let puzzle: Puzzle;
	const { component, state } = puzzle;
</script>

<section>
	{#if component.type === 'unaryDigitalState'}
		<UnaryDigitalState {component} {state} {puzzle} />
	{:else if component.type === 'digitalState'}
		<DigitalState {component} {state} {puzzle} />
	{:else if component.type === 'sequence'}
		Sequence
	{:else if component.type === 'speechDetection'}
		SpeechDetection
	{/if}
</section>
