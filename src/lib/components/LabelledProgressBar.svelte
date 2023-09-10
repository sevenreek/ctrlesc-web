<script>
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let classes = '';
	export { classes as class };
</script>

<div class={classes}>
	<div class="px-1 flex flex-row items-center justify-between">
		<slot name="left" />
		<slot name="right" />
	</div>
	<ProgressBar {...$$restProps} />
</div>
