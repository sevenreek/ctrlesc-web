<script>
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let leftText = '';
	export let rightText = '';
	export let classes = '';
	export { classes as class };
</script>

<div class={classes}>
	{#if leftText || rightText}
		<div class="px-1 flex flex-row items-center justify-between">
			<span class="text-sm">{leftText}</span>
			<span class="text-sm">{rightText}</span>
		</div>
	{/if}
	<ProgressBar {...$$restProps} />
</div>
