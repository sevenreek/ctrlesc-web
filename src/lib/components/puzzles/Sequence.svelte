<script lang="ts">
	import 'iconify-icon';
	import type { SequenceComponent } from '$lib/component';
	import type { Puzzle } from '$lib/room';
	export let puzzle: Puzzle;
	const { state } = puzzle;
	const component = puzzle.component as SequenceComponent;
	const { stateMap } = component;
	const sequence = (state ? state['sequence'] : []) as any[];
	const targetSequence = component.targetSequence;

	function formatElement(element: any) {
		if (typeof element === 'number') {
			return stateMap[element.toString()];
		} else if (typeof element === 'string') {
			return stateMap[element];
		}
		return '?';
	}
	const sequenceDisplay = sequence.map((element, i) => {
		const elementSet = element != null;
		const matchesTarget = element === targetSequence[i];
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
	console.log(sequenceDisplay);
</script>

<div class="flex flex-row justify-center items-start gap-2">
	{#each sequenceDisplay as element}
		<span class="chip {element.variant} px-6 py-4 text-xl cursor-default">{element.value}</span>
	{/each}
</div>
