<script lang="ts">
	import { onMount } from 'svelte';
	import * as sse from '$lib/api/sse';
	import type { PageData } from './$types';
	import { Stepper, Step, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import TimeControls from './TimeControls.svelte';
	import Puzzle from '$lib/components/puzzles/Puzzle.svelte';
	import { updateRoomStage } from '$lib/room';
	export let data: PageData;
	let room = data.room;
	let {
		state,
		baseTime,
		extraTime,
		startedOn,
		pausedOn,
		stoppedOn,
		activeStage: activeStageIndex
	} = room;
	let stages = room.stages;
	const { name, imageUrl } = room;
	const activeStage = activeStageIndex ? stages[activeStageIndex] : null;
	let tabSet: number = 0;

	onMount(() => {
		const handler = sse.addListener((data: sse.SSEUpdate) => {
			console.log(data, data['stage'], data['puzzle']);
			stages = updateRoomStage(stages, data, data['stage'], data['puzzle']);
			stages = [...stages];
			console.log(stages);
		});
		return () => {
			sse.removeListener(handler);
		};
	});
</script>

<div class="container h-full mx-auto px-8 py-6">
	<h1 class="text-4xl font-bold pb-4 text-center">{name}</h1>
	<TabGroup justify="justify-center">
		<Tab bind:group={tabSet} name="game" value={0}>
			<span>Game Control</span>
		</Tab>
		<Tab bind:group={tabSet} name="statistics" value={1}>
			<span>Statistics</span>
		</Tab>
		<Tab bind:group={tabSet} name="log" value={2}>
			<span>Logs</span>
		</Tab>
		<Tab bind:group={tabSet} name="config" value={3}>
			<span>Configuration</span>
		</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			{#if tabSet === 0}
				<div class="flex pt-6 flex-col gap-10 justify-center items-center w-full">
					<TimeControls room={data.room} />
					<Stepper stepTerm="Stage" class="w-full">
						{#each stages as stage (stage.slug)}
							<Step>
								<h2 slot="header" class="text-xl">{stage.name}</h2>
								<span class="italic text-sm">{stage.description}</span>
								{#each stage.puzzles as puzzle (puzzle.slug)}
									<Puzzle {puzzle} />
								{/each}
							</Step>
						{/each}
					</Stepper>
				</div>
			{:else if tabSet === 1}
				(tab panel 2 contents)
			{:else if tabSet === 2}
				(tab panel 3 contents)
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
