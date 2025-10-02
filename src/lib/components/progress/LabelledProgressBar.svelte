<script lang="ts">
    import * as Progress from "$lib/components/ui/progress";
	import type { Snippet } from "svelte";

	let {class: classes = "", left, right, ...rest}: {
		value: number | null,
        class?: string,
        left?: Snippet,
        right?: Snippet,
		max: number
    } = $props()
</script>

<div class={classes}>
	<div class="px-1 flex flex-row items-center justify-between">
		<div>{@render left?.()}</div>
		<div>{@render right?.()}</div>
	</div>
	<Progress.Root {...rest} />
</div>
