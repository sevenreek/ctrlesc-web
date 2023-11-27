<script lang="ts">
	import 'iconify-icon';
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { DigitalStateComponent, ComponentState } from '$lib/component';
	import type { Puzzle } from '$lib/room';
	export let puzzle: Puzzle;
	$: ({ component, state } = puzzle);
	$: ({ stateMap, nameMap } = component);

	$: stateToDisplay = Object.entries(state ?? {}).map(([key, value]) => {
		return { part: nameMap ? nameMap[key] : key, state: stateMap[value] };
	});

	$: tableSource = {
		head: [],
		body: tableMapperValues(stateToDisplay, ['part', 'state'])
	};
</script>

<div class="flex flex-col justify-between items-start gap-2">
	<Table source={tableSource} />
</div>
