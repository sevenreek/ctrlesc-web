<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';

	export let baseTime: number = 3600;
	export let extraTime = 0;
	export let label = '';
	export let startedOn: string|null = null;
	export let stoppedOn: string|null = null;
	let elapsedTime: number|undefined = 0;
	let elapsed: number;
	let barColor = "hsl(200,100%,50%)";

	$: totalTime = extraTime + baseTime;
	$: {
		if(stoppedOn) {
			elapsedTime = totalTime;
		}
		else if(startedOn) {
			elapsedTime = (Date.now() - Date.parse(startedOn))/1000;
		}
		else {
			elapsedTime = undefined;
		}
		if(elapsedTime) {
			elapsed = totalTime == 0 ? 1 : elapsedTime/totalTime;
			barColor = getPercentageColor(1-elapsed);
		}
	}

	function getPercentageColor(value: number) {
		var hue=((value)*120).toString(10);
		return ["hsl(",hue,",60%,45%)"].join("");
	}
</script>

<ProgressBar rounded="rounded-none" meter="progress-bar-dynamic" label value={elapsedTime} max={totalTime} --bar-color={barColor}  />

<style>
	:global(.progress-bar-dynamic) {
		background-color: var(--bar-color);
	}
</style>

