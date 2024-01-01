<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { STAGEPAGER_CONTEXT, type PagerState } from './util';
	import { STAGE_CONTEXT } from '$lib/api/rooms';

	export let state: Writable<PagerState> = getContext(STAGEPAGER_CONTEXT);

	const thisStageIndex = $state.stageCount;
	setContext(STAGE_CONTEXT, { index: thisStageIndex });
	$state.stageCount++;
</script>

{#if $state.chosenStage === thisStageIndex}
	<div>
		<slot />
	</div>
{/if}
