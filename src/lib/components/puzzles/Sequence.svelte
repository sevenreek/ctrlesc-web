<script lang="ts">
	import 'iconify-icon';
	import type { AnyPuzzle, SequencePuzzle } from '$lib/room';
	export let puzzle: AnyPuzzle;
	$: ({
		state,
		extras: { targetState },
		stateMap
	} = puzzle as SequencePuzzle);

	function formatElement(element: any) {
		if (typeof element === 'number') {
			return stateMap[element.toString()];
		} else if (typeof element === 'string') {
			const mapped = stateMap[element];
			return mapped === undefined ? element : mapped;
		}
		return '?';
	}
	$: sequenceDisplay = state.map((element, i) => {
		const elementSet = element != null;
		const matchesTarget = element === targetState[i];
		let displayValue = '?';
		let chipVariant = 'variant-ghost';
		if (elementSet) {
			displayValue = formatElement(element);
			if (matchesTarget) {
				chipVariant = 'variant-filled-success';
			} else {
				chipVariant = 'variant-filled';
			}
		}
		return { value: displayValue, variant: chipVariant };
	});
</script>

<div class="flex flex-row justify-center items-start gap-2">
	{#each sequenceDisplay as element}
		<span class="chip {element.variant} px-6 py-4 text-xl cursor-default">{element.value}</span>
	{/each}
</div>
