<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as sse from '$lib/api/sse';
	import type { PageData } from './$types';
	import { Stepper, Step, TabGroup, Tab } from '@skeletonlabs/skeleton';
	import 'iconify-icon';
	import TimeControls from './TimeControls.svelte';
	import Puzzle from '$lib/components/puzzles/Puzzle.svelte';
	import { updateRoom, type Room } from '$lib/room';
	import { ROOM_CONTEXT, ROOM_STATE_CONTEXT } from '$lib/api/rooms';
	import StagePager from '$lib/components/StagePager/StagePager.svelte';
	import Stage from '$lib/components/StagePager/Stage.svelte';
	import { writable } from 'svelte/store';
	import GameTimePlot from '$lib/components/GameTimePlot.svelte';
	import Statistics from './tabs/Statistics.svelte';
	import GameControl from './tabs/GameControl.svelte';
	import type { Tabs } from './tabs/types';

	export let data: PageData;

	function getTabIndex(tab?: Tabs) {
		switch (tab) {
			default:
			case 'game':
				return 0;
			case 'stats':
				return 1;
			case 'logs':
				return 2;
			case 'config':
				return 3;
		}
	}

	function changeTab(tab: Tabs) {
		const split = $page.url.pathname.split('/');
		if (split.at(-1) === room.slug) split.push(tab);
		else split[split.length - 1] = tab;
		goto(split.join('/'));
	}
	let { room, tab, compareSegments } = data;

	let roomStateContext = writable({ activeStage: 0, state: 'ready' });

	$: ({ stages, state, baseTime, extraTime, activeStage: activeStageIndex, activeGameId } = room);
	$: roomStateContext.update((prev) => ({ ...prev, activeStage: activeStageIndex ?? 0, state }));
	$: activeStage = activeStageIndex ? stages[activeStageIndex] : null;

	setContext(ROOM_CONTEXT, room);
	setContext(ROOM_STATE_CONTEXT, roomStateContext);

	const { name, imageUrl } = room;
	let tabSet: number = getTabIndex(tab);

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
	<h1 class="text-4xl font-bold pb-1 text-center">{name}</h1>
	{#if activeGameId}
		<h2 class="text-xs pb-4 text-center">{activeGameId}</h2>
	{/if}
	<TabGroup justify="justify-center">
		<Tab
			bind:group={tabSet}
			name="game"
			value={0}
			on:click={() => {
				changeTab('game');
			}}
		>
			<span>Game Control</span>
		</Tab>
		<Tab
			on:click={() => {
				changeTab('stats');
			}}
			bind:group={tabSet}
			name="stats"
			value={1}
		>
			<span>Statistics</span>
		</Tab>
		<Tab
			on:click={() => {
				changeTab('logs');
			}}
			bind:group={tabSet}
			name="logs"
			value={2}
		>
			<span>Logs</span>
		</Tab>
		<Tab
			on:click={() => {
				changeTab('config');
			}}
			bind:group={tabSet}
			name="config"
			value={3}
		>
			<span>Configuration</span>
		</Tab>
		<!-- Tab Panels --->
		<svelte:fragment slot="panel">
			<div class="flex pt-6 flex-col gap-10 justify-center items-center w-full">
				{#if tabSet === 0}
					<GameControl {room} />
				{:else if tabSet === 1}
					<Statistics {room} {compareSegments} />
				{:else if tabSet === 2}
					(tab panel 3 contents)
				{/if}
			</div>
		</svelte:fragment>
	</TabGroup>
</div>
