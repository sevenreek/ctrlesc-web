<script lang="ts">
	import 'iconify-icon';
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';
	import type { DigitalStateComponent, ComponentState } from '$lib/component';
	export let name: string;
	export let component: DigitalStateComponent;
	export let state: ComponentState;

	const { completeOverrideEnabled, stateMap, nameMap } = component;

	const stateToDisplay = Object.entries(state ?? {}).map(([key, value]) => {
		return { part: nameMap ? nameMap[key] : key, state: stateMap[value] };
	});

	const tableSource: TableSource = {
		head: ['Part', 'State'],
		body: tableMapperValues(stateToDisplay, ['part', 'state'])
	};
</script>

<Table source={tableSource} />
