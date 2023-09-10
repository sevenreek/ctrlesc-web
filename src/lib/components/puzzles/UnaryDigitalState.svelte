<script lang="ts">
	import 'iconify-icon';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import type { UnaryDigitalStateComponent, ComponentState } from '$lib/component';
	import type { Puzzle } from '$lib/room';
	export let puzzle: Puzzle;
	export let component: UnaryDigitalStateComponent;
	export let state: ComponentState;

	const { name, completed } = puzzle;

	const { completeOverrideEnabled, stateMap, nameMap } = component;

	const stateToDisplay = Object.entries(state ?? {}).map(([key, value]) => {
		return { part: nameMap ? nameMap[key] : key, state: stateMap[value] };
	});
</script>

<div class="card p-4 flex flex-row justify-between items-center max-w-xs">
	<h2 class="text-lg">{name}</h2>
	<SlideToggle name="slider-label" disabled />
</div>
