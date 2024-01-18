<script lang="ts">
	import { getRandomInt } from '$lib/util/random';
	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	export let classes = '';
	export { classes as class };
	let svg: SVGElement;
	const STAGE_COUNT = 8;
	let width = 0;
	let height = 0;
	let elapsedTime = 0;
	let elapsedCompletion = 0;
	let xTickCount = 5;
	let yTickCount = 5;

	const randomTime = d3.randomInt(1 * 60, 6 * 60);
	const randomCompletion = d3.randomInt(3, 30);
	const randomDeltaTime = d3.randomInt(15, 3 * 60);
	const mockAverage = (min: number, max: number) =>
		getRandomInt(min + (max - min) / 3, min + (2 * (max - min)) / 3);
	const zeroIfUndefined = (r?: number) => (r === undefined ? 0 : r);

	const best = Array.from(d3.cumsum(d3.range(STAGE_COUNT).map(() => randomTime())));
	const worst = Array.from(
		d3.cumsum(d3.range(STAGE_COUNT).map((i) => best[i] + randomDeltaTime()))
	);
	const average = Array.from(
		d3.cumsum(d3.range(STAGE_COUNT).map((i) => mockAverage(best[i], worst[i])))
	);
	const completion = Array.from(d3.cumsum(d3.range(STAGE_COUNT).map(() => randomCompletion())));
	const yExtent = d3.extent(best.concat(worst)).map(zeroIfUndefined) as [number, number];
	const xExtent = d3.extent(completion.concat(elapsedCompletion)).map(zeroIfUndefined) as [
		number,
		number
	];

	const padding = { left: 50, right: 10, top: 10, bottom: 10 };

	$: xScale = d3
		.scaleLinear()
		.domain(xExtent)
		.range([padding.left, width - padding.right]);
	$: yScale = d3
		.scaleLinear()
		.domain(yExtent)
		.range([height - padding.bottom, padding.top]);
	let xTicks = d3.ticks(...xExtent, xTickCount);
	let yTicks = d3.ticks(...yExtent, yTickCount);
	onMount(() => {
		onResize();
	});
	function onResize() {
		({ width, height } = svg.getBoundingClientRect());
		console.log(width, height);
	}
</script>

<svelte:window on:resize={onResize} />

<div class="w-full h-72">
	<svg bind:this={svg} class="w-full h-full">
		<g class="axis y-axis">
			{#each yTicks as tick}
				<line x1={xScale(xExtent[0])} y1={yScale(tick)} x2={xScale(xExtent[1])} y2={yScale(tick)} />
				<text x={8} y={yScale(tick) + 6}>{Math.floor(tick / 60)}</text>
			{/each}
		</g>
		<!-- data -->
		{#each best as point, index}
			{@const currentCompletion = completion[index]}
			{#if index > 0}
				{@const prevX = best[index - 1]}
				{@const prevCompletion = completion[index - 1]}
				<line
					x1={xScale(prevCompletion)}
					y1={yScale(prevX)}
					x2={xScale(currentCompletion)}
					y2={yScale(point)}
					stroke={'black'}
				/>
			{/if}
		{/each}
		{#each worst as point, index}
			{@const currentCompletion = completion[index]}
			{#if index > 0}
				{@const prevX = worst[index - 1]}
				{@const prevCompletion = completion[index - 1]}
				<line
					x1={xScale(prevCompletion)}
					y1={yScale(prevX)}
					x2={xScale(currentCompletion)}
					y2={yScale(point)}
					stroke={'black'}
				/>
			{/if}
		{/each}
		{#each average as point, index}
			{@const currentCompletion = completion[index]}
			{#if index > 0}
				{@const prevX = average[index - 1]}
				{@const prevCompletion = completion[index - 1]}
				<line
					x1={xScale(prevCompletion)}
					y1={yScale(prevX)}
					x2={xScale(currentCompletion)}
					y2={yScale(point)}
					stroke={'black'}
				/>
			{/if}
		{/each}
	</svg>
</div>

<style>
	.axis {
		stroke: #ddd;
	}
	.axis line {
		stroke-dasharray: 2;
	}
</style>
