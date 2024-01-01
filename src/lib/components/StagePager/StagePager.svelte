<script lang="ts">
	import { setContext } from 'svelte';
	import { STAGEPAGER_CONTEXT, type PagerState } from './util';
	import { writable, type Writable } from 'svelte/store';
	export let activeStage = 0;
	export let stageTerm = 'Stage';

	let state: Writable<PagerState> = writable({
		stageCount: 0,
		chosenStage: activeStage,
		inactiveChosen: false
	});
	setContext(STAGEPAGER_CONTEXT, state);
	$: {
		if (!$state.inactiveChosen && activeStage !== $state.chosenStage) {
			state.update((prev) => ({ ...prev, inactiveChosen: false, chosenStage: activeStage }));
		}
	}
	$: isStepActive = (step: number) => step === $state.chosenStage;
	$: getStepBadgeVariant = (step: number) => {
		const isChosen = step === $state.chosenStage;
		const isCompleted = step < activeStage;
		const isActive = step === activeStage;
		let base = 'variant-filled-surface';
		if (isActive) {
			base = 'variant-filled';
		} else if (isCompleted) {
			base = 'variant-filled-success';
		}
		return `${base}`;
	};
</script>

<div class={$$props.class || ''}>
	<header
		class="flex flex-row gap-2 mb-4 border-t items-center mt-[14px] border-surface-400-500-token"
	>
		{#each Array.from(Array($state.stageCount).keys()) as step}
			{@const isActive = isStepActive(step)}
			<div class="-mt-[14px] transition-all duration-300" class:flex-1={isActive}>
				<button
					class="badge {getStepBadgeVariant(step)}"
					on:click={() => {
						state.update((prev) => ({
							...prev,
							chosenStage: step,
							inactiveChosen: activeStage !== step
						}));
					}}
				>
					{isActive ? `${stageTerm} ${step + 1}` : step + 1}
				</button>
			</div>
		{/each}
	</header>
	<slot />
</div>
