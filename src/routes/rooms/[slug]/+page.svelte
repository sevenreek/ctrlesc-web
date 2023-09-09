<script lang="ts">
	import type { PageData } from './$types';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import TimeControls from './TimeControls.svelte';
	export let data: PageData;
	const {
		state,
		baseTime,
		extraTime,
		startedOn,
		pausedOn,
		stoppedOn,
		name,
		imageUrl,
		stages,
		activeStage: activeStageIndex
	} = data.room;
	const activeStage = activeStageIndex ? stages[activeStageIndex] : null;
</script>

<div class="container h-full mx-auto p-4">
	<h1 class="text-3xl font-bold pb-12">{name}</h1>
	<div class="flex flex-col gap-10 justify-center items-center w-full px-6">
		<TimeControls room={data.room} />
		<Stepper stepTerm="Stage" class="w-full">
			{#each stages as stage}
				<Step>
					<h2 slot="header" class="text-xl">{stage.name}</h2>
					<span class="italic text-sm">{stage.description}</span>
				</Step>
			{/each}
		</Stepper>
	</div>
</div>
