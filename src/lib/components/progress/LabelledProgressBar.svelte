<script lang="ts">
    import { Progress } from "@skeletonlabs/skeleton-svelte";
	import type { Snippet } from "svelte";

	let {class: classes, left, right, ...rest}: {
        class: string,
        left?: Snippet,
        right?: Snippet,
    } = $props()
</script>

<div class={classes}>
	<div class="px-1 flex flex-row items-center justify-between">
		<div>{@render left?.()}</div>
		<div>{@render right?.()}</div>
	</div>
	<Progress {...rest} />
</div>
