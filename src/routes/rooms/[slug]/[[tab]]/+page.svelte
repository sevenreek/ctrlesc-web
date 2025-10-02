<script lang="ts">
	import { setContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from "$app/state"
	import * as sse from '$lib/api/sse';
	import type { PageData } from './$types';
	import { updateRoom, type Room } from '$lib/room';
	import { ROOM_CONTEXT, ROOM_STATE_CONTEXT } from '$lib/api/rooms';
	import type { TabID } from './tabs/types';
	import * as Tabs from "$lib/components/ui/tabs"
	import GameControl from './tabs/GameControl.svelte';

	let {data}: {data: PageData} = $props();

	let { room: _room, compareSegments, url } = $derived(data);

	function changeTab(newTab: TabID) {
		const split = url.pathname.split('/');
		if (split.at(-1) === room.slug) split.push(newTab);
		else split[split.length - 1] = newTab;
		const newUrl = split.join("/");
		goto(newUrl);
	}
	let room = $state(_room);
	let { stages, state: roomState, baseTime, extraTime, activeStage: activeStageIndex, activeGameId } = $derived(room);

	let roomStateContext = $state({ activeStage: activeStageIndex, state: roomState });

	$effect(() => {
		roomStateContext.activeStage = activeStageIndex ?? 0;
		roomStateContext.state = roomState;
	});
	let activeStage = $derived(activeStageIndex ? stages[activeStageIndex] : null);

	setContext(ROOM_CONTEXT, room);
	setContext(ROOM_STATE_CONTEXT, roomStateContext);

	const { name, imageUrl } = $derived(room);

	$effect(() => {
		room = _room;
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

<div class="container h-full mx-auto px-8 py-6 w-full">
	<h1 class="text-4xl font-bold pb-1 text-center">{name}</h1>
	{#if activeGameId}
		<h2 class="text-xs pb-4 text-center">{activeGameId}</h2>
	{/if}
	<Tabs.Root value={page.params.tab ?? "game"} class="w-full">
		<Tabs.List class="w-full">
			<Tabs.Trigger
				onclick={() => changeTab("game")}
				value="game"
			>
				<span>Game</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				onclick={() => changeTab("stats")}
				value="stats"
			>
				<span>Statistics</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				onclick={() => changeTab("logs")}
				value="logs"
			>
				<span>Logs</span>
			</Tabs.Trigger>
			<Tabs.Trigger
				onclick={() => changeTab("config")}
				value="config"
			>
				<span>Configuration</span>
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="game" class="flex flex-col items-center">
			<GameControl room={room}/>
		</Tabs.Content>
		<Tabs.Content value="stats">
			stats
		</Tabs.Content>
		<Tabs.Content value="logs">
			"logs"
		</Tabs.Content>
		<Tabs.Content value="logs">
			"config"
		</Tabs.Content>
	</Tabs.Root>
</div>
