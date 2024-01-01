<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import * as sse from '$lib/api/sse';
	import type { PageData } from './$types';
	import { Stepper, Step, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import TimeControls from './TimeControls.svelte';
	import Puzzle from '$lib/components/puzzles/Puzzle.svelte';
	import { updateRoom, type Room } from '$lib/room';
	import { ROOM_CONTEXT, ROOM_STATE_CONTEXT, type RoomConfigContext } from '$lib/api/rooms';
	import StagePager from '$lib/components/StagePager/StagePager.svelte';
	import Stage from '$lib/components/StagePager/Stage.svelte';
	import { writable } from 'svelte/store';

	export let data: PageData;

	let room = data.room;
	let roomStateContext = writable({ activeStage: 0, state: 'ready' });

	$: ({ stages, state, baseTime, extraTime, activeStage: activeStageIndex } = room);
	$: roomStateContext.update((prev) => ({ ...prev, activeStage: activeStageIndex ?? 0, state }));
	$: activeStage = activeStageIndex ? stages[activeStageIndex] : null;

	setContext(ROOM_CONTEXT, {
		slug: room.slug
	});
	setContext(ROOM_STATE_CONTEXT, roomStateContext);

	const { name, imageUrl } = room;
	let tabSet: number = 0;

	onMount(() => {
		const handler = sse.addListener((data: sse.SSEUpdate) => {
			const newRoom = updateRoom(room, data);
			console.log(room, data, newRoom);
			room = newRoom;
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
					<TimeControls {room} />
					<StagePager class="w-full" activeStage={activeStageIndex ?? 0}>
						{#each stages as stage (stage.slug)}
							<Stage>
								<span class="italic text-sm">{stage.description}</span>
								{#each stage.puzzles as puzzle (puzzle.slug)}
									<Puzzle {puzzle} stageSlug={stage.slug} />
								{/each}
							</Stage>
						{/each}
					</StagePager>
				</div>
			{:else if tabSet === 1}
				(tab panel 2 contents)
			{:else if tabSet === 2}
				(tab panel 3 contents)
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>
