<script lang="ts">
	import type { DigitalStatePuzzle } from '$lib/room';
	import * as Table from '$lib/components/ui/table';

	let { puzzle }: { puzzle: DigitalStatePuzzle } = $props();

	let stateToDisplay = $derived(
		Object.entries(puzzle.state ?? ({} as Record<string, boolean>)).map(([key, value]) => {
			return {
				part: puzzle.nameMap ? puzzle.nameMap[key] : key,
				state: puzzle.stateMap[value.toString()]
			};
		})
	);
</script>

<div class="flex flex-col items-start justify-between gap-2">
	<Table.Root>
		<Table.Body>
			{#each stateToDisplay as item}
			<Table.Row>
				<Table.Cell>{item.part}</Table.Cell>
				<Table.Cell>{item.state}</Table.Cell>
			</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
