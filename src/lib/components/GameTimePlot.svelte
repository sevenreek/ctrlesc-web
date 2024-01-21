<script lang="ts">
	import { getRandomInt } from '$lib/util/random';
	import * as d3 from 'd3';
	import { getContext, onMount } from 'svelte';
	import { popup } from '@skeletonlabs/skeleton';
	import { type PopupSettings } from '@skeletonlabs/skeleton';
	import { svgTooltip } from '$lib/util/popup';
	import { nanoid } from 'nanoid';
	import { ROOM_CONTEXT } from '$lib/api/rooms';
	import type { RoomConfig } from '$lib/room';
	import { formatDuration } from '$lib/timeUtil';

	export let classes = '';
	export { classes as class };

	let room: RoomConfig = getContext(ROOM_CONTEXT);
	let svg: SVGElement;
	const STAGE_COUNT = room.stages.length;
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

	const best = d3.range(STAGE_COUNT).map(() => randomTime());
	const bestCum = Array.from(d3.cumsum(best));
	const worst = d3.range(STAGE_COUNT).map((i) => bestCum[i] + randomDeltaTime());
	const worstCum = Array.from(d3.cumsum(worst));
	const averageCum = Array.from(
		d3.range(STAGE_COUNT).map((i) => mockAverage(bestCum[i], worstCum[i]))
	);
	const average: number[] = averageCum.map((val, i) => (i > 0 ? val - averageCum[i - 1] : 0));
	bestCum.unshift(0);
	worstCum.unshift(0);
	averageCum.unshift(0);
	const completion = Array.from(d3.cumsum(d3.range(STAGE_COUNT).map(() => randomCompletion())));
	completion.unshift(0);
	const yExtent = d3.extent(bestCum.concat(worstCum)).map(zeroIfUndefined) as [number, number];
	const xExtent = d3.extent(completion.concat(elapsedCompletion)).map(zeroIfUndefined) as [
		number,
		number
	];

	const padding = { left: 50, right: 10, top: 10, bottom: 40 };

	$: xScale = d3
		.scaleLinear()
		.domain(xExtent)
		.range([padding.left, width - padding.right]);
	$: yScale = d3
		.scaleLinear()
		.domain(yExtent)
		.range([height - padding.bottom, padding.top]);
	let xTicks = d3.ticks(...xExtent, xTickCount);
	let yTicks = d3.range(yExtent[0], yExtent[1], 1800);
	onMount(() => {
		onResize();
	});
	function onResize() {
		({ width, height } = svg.getBoundingClientRect());
	}
	$: console.log(
		{ width, height },
		{ xExtent, yExtent },
		padding,
		{ xScale, xTicks, yScale, yTicks },
		{ completion, best: bestCum, worst: worstCum, average: averageCum }
	);
	$: tooltipData = {
		stageName: '',
		best: 0,
		average: 0,
		worst: 0,
		completion: 0,
		current: null
	};
	const popupId = nanoid();
</script>

<svelte:window on:resize={onResize} />

<div class="w-full h-72">
	<div class="card p-2 variant-filled-surface absolute opacity-0" id={popupId}>
		<h4>{tooltipData.stageName}</h4>
		<div class="grid grid-cols-2 text-xs p-1">
			<span>Best:</span><span>{formatDuration(tooltipData.best)}</span>
			<span>Avg:</span><span>{formatDuration(tooltipData.average)}</span>
			<span>Worst:</span><span>{formatDuration(tooltipData.worst)}</span>
		</div>
		<div class="arrow variant-filled-secondary" />
	</div>
	<svg bind:this={svg} class="w-full h-full">
		{#if width && height}
			<rect
				class="border"
				x={xScale(xExtent[0])}
				y={yScale(yExtent[1])}
				width={xScale.range()[1] - xScale.range()[0]}
				height={yScale.range()[0] - yScale.range()[1]}
			/>
			<g class="stages">
				{#each completion as tick, index}
					<!-- stage areas -->
					{#if index > 0}
						{@const prevTick = completion[index - 1]}
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-mouse-events-have-key-events -->
						<rect
							use:svgTooltip={{ target: popupId, placement: 'bottom', offset: 4 }}
							on:mouseover={() => {
								tooltipData = {
									...tooltipData,
									stageName: room.stages[index - 1].name,
									best: best[index - 1],
									worst: worst[index - 1],
									average: average[index - 1]
								};
							}}
							class="stagearea"
							x={xScale(prevTick)}
							y={yScale(yExtent[1])}
							width={xScale(tick) - xScale(prevTick)}
							height={yScale.range()[0] - yScale.range()[1]}
						/>
					{/if}
					<!-- stage lines -->
					<line
						class="stageline"
						x1={xScale(tick)}
						y1={yScale(yExtent[0])}
						x2={xScale(tick)}
						y2={yScale(yExtent[1])}
					/>
				{/each}
			</g>
			<!-- horizontal lines -->
			<g class="axis y-axis">
				{#each yTicks as tick}
					<line
						x1={xScale(xExtent[0])}
						y1={yScale(tick)}
						x2={xScale(xExtent[1])}
						y2={yScale(tick)}
					/>
					<text x={8} y={yScale(tick) + 6}>{Math.floor(tick / 60)}</text>
				{/each}
			</g>
			<!-- data -->
			<g class="best">
				{#each bestCum as point, index}
					{@const currentCompletion = completion[index]}
					{#if index > 0}
						{@const prevX = bestCum[index - 1]}
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
			</g>
			<g class="worst">
				{#each worstCum as point, index}
					{@const currentCompletion = completion[index]}
					{#if index > 0}
						{@const prevX = worstCum[index - 1]}
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
			</g>
			<g class="average">
				{#each averageCum as point, index}
					{@const currentCompletion = completion[index]}
					{#if index > 0}
						{@const prevX = averageCum[index - 1]}
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
			</g>
		{/if}
	</svg>
</div>

<style>
	.border {
		fill: none;
		stroke: #ddd;
	}
	.stagearea {
		transition: opacity 100ms ease-in;
		fill: #ddd;
		opacity: 0;
	}
	.stagearea:hover {
		transition: opacity 100ms ease-out;
		opacity: 0.4;
	}
	.stages {
	}
	.stageline {
		stroke: #ddd;
		transition: stroke-width 200ms ease-in;
		stroke-width: 2px;
		pointer-events: all;
	}
	.stageline:hover {
		transition: stroke-width 200ms ease-out;
		stroke-width: 5px;
	}
	.axis {
		stroke: #ddd;
	}
	.axis line {
		stroke-dasharray: 2;
	}
</style>
