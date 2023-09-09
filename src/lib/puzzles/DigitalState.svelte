<script lang="ts">
	import 'iconify-icon';
	import { Table, tableMapperValues } from '@skeletonlabs/skeleton';
	import type { TableSource } from '@skeletonlabs/skeleton';

	export let nameMapping: { [key: string]: string };
	export let stateMapping: { [key: string]: string };
	export let stateData: { [key: string]: any };
	const modifiedData = Object.entries(stateData).map(([key, value]) => {
		return { part: nameMapping[key], state: stateMapping[value] };
	});

	const tableSource: TableSource = {
		head: ['Part', 'State'],
		body: tableMapperValues(modifiedData, ['part', 'state'])
	};
</script>

<Table source={tableSource} />
