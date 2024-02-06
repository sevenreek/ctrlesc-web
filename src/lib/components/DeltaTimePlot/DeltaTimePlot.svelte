<script lang="ts">
	import { getRandomInt } from '$lib/util/random';
	import * as d3 from 'd3';
	import { getContext, onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { svgTooltip } from '$lib/util/popup';
	import { nanoid } from 'nanoid';
	import { ROOM_CONTEXT } from '$lib/api/rooms';
	import type { RoomConfig, Stage } from '$lib/room';
	import { formatDuration } from '$lib/timeUtil';
	import { getLineSegments, getAreaPoints, type LineSegment } from './points';
	import { getStageMaxCompletion } from '$lib/api/roomUtil';

	export let title = 'Delta Time';
	export let colorArea = true;

	export let source: number[];
	export let compare: Record<string, number[]>;
	export let stages: Stage[];

	const stagePopupId = nanoid();
	const zeroIfUndefined = (r?: number) => (r === undefined ? 0 : r);

	let svg: SVGElement;
	let width = 0;
	let height = 0;
	let elapsedTime = 0;
	let elapsedCompletion = 0;
	let xTickCount = 5;
	let yTickCount = 5;
	let padding = { left: 50, right: 10, top: 10, bottom: 40 };
	let compareDataChoice = Object.keys(compare)[0];

	function onResize() {
		({ width, height } = svg.getBoundingClientRect());
	}
	$: compareData = compare[compareDataChoice];
	$: deltaData = [0, ...source.map((el, i) => el - compareData[i])];
	$: deltaCum = Array.from(d3.cumsum(deltaData));
	$: stageCompletions = stages.map(getStageMaxCompletion);
	$: stageCompletionCum = stageCompletions.reduce(
		(acc, s, i) => {
			acc.push(acc[i] + s);
			return acc;
		},
		[0]
	);
	$: yExtent = d3.nice(
		...(d3.extent(deltaCum).map(zeroIfUndefined) as [number, number]),
		yTickCount
	) as [number, number];
	$: xExtent = d3.extent(stageCompletionCum.concat(elapsedCompletion)).map(zeroIfUndefined) as [
		number,
		number
	];
	$: xTicks = d3.ticks(...xExtent, xTickCount);
	$: yTicks = d3.ticks(...yExtent, yTickCount);
	$: xScale = d3
		.scaleLinear()
		.domain(xExtent)
		.range([padding.left, width - padding.right]);
	$: yScale = d3
		.scaleLinear()
		.domain(yExtent)
		.range([height - padding.bottom, padding.top]);
	$: tooltipData = {
		stageName: '',
		delta: 0,
		deltaCum: 0
	};
	$: lineSegments = deltaCum.flatMap((currentY, i) => {
		if (i == 0) return [];
		const prevX = stageCompletionCum[i - 1];
		const prevY = deltaCum[i - 1];
		const currentX = stageCompletionCum[i];
		const segments = getLineSegments({ x: prevX, y: prevY }, { x: currentX, y: currentY });
		return segments;
	});
	onMount(() => {
		onResize();
	});
</script>

<svelte:window on:resize={onResize} />

<div class="card p-2 variant-filled-surface absolute opacity-0" id={stagePopupId}>
	<h4 class="font-semibold text-sm">{tooltipData.stageName}</h4>
	<div class="grid grid-cols-2 text-xs p-1 gap-1">
		<span>Stage loss: </span><span>{formatDuration(tooltipData.delta)}</span>
		<span>Cumulative loss: </span><span>{formatDuration(tooltipData.deltaCum)}</span>
	</div>
	<div class="arrow variant-filled-secondary" />
</div>
<div class="w-full">
	<div class="flex text-lg flex-row gap-2 items-center justify-center grow-0">
		<h2>{title}</h2>
		<span class="text-base">vs.</span>
		{#if Object.keys(compare).length > 1}
			<select class="select w-auto" bind:value={compareDataChoice}>
				{#each Object.keys(compare) as choice}
					<option value={choice}>{choice}</option>
				{/each}
			</select>
		{:else}
			<span>{compareDataChoice}</span>
		{/if}
	</div>
	{#if width === 0}
		<div class="flex justify-center items-center h-full">
			<ProgressRadial value={undefined} />
		</div>
	{/if}
	<svg bind:this={svg} class="w-full h-72">
		{#if width && height}
			<!-- horizontal lines -->
			<g class="axis y-axis">
				{#each yTicks as tick}
					<line
						x1={xScale(xExtent[0])}
						y1={yScale(tick)}
						x2={xScale(xExtent[1])}
						y2={yScale(tick)}
					/>
					<text x={xScale(xExtent[0]) - 8} y={yScale(tick) + 6}>{formatDuration(tick)}</text>
				{/each}
			</g>
			<line
				class="zero"
				x1={xScale(xExtent[0])}
				x2={xScale(xExtent[1])}
				y1={yScale(0)}
				y2={yScale(0)}
			/>
			<!-- data -->
			<g class="series">
				{#each lineSegments as seg}
					<line
						x1={xScale(seg.x1)}
						y1={yScale(seg.y1)}
						x2={xScale(seg.x2)}
						y2={yScale(seg.y2)}
						style="stroke: {seg.lineColor};"
					/>
					{#if colorArea}
						<polygon
							points={getAreaPoints(seg, xScale, yScale)}
							style="fill: {seg.areaColor}"
							class="opacity-10"
						/>
					{/if}
				{/each}
			</g>
			<g class="stages">
				{#each stageCompletionCum as tick, index}
					<g class="stage">
						<!-- stage areas -->
						{#if index > 0}
							{@const prevTick = stageCompletionCum[index - 1]}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-mouse-events-have-key-events -->
							<rect
								use:svgTooltip={{ target: stagePopupId, placement: 'bottom', offset: 4 }}
								on:mouseover={() => {
									tooltipData = {
										...tooltipData,
										stageName: stages[index - 1].name,
										delta: deltaData[index],
										deltaCum: deltaCum[index]
									};
								}}
								x={xScale(prevTick)}
								y={yScale(yExtent[1])}
								width={xScale(tick) - xScale(prevTick)}
								height={yScale.range()[0] - yScale.range()[1]}
							/>
						{/if}
						<!-- stage lines -->
						<line
							x1={xScale(tick)}
							y1={yScale(yExtent[0])}
							x2={xScale(tick)}
							y2={yScale(yExtent[1])}
						/>
					</g>
				{/each}
			</g>
			<rect
				class="border"
				x={xScale(xExtent[0])}
				y={yScale(yExtent[1])}
				width={xScale.range()[1] - xScale.range()[0]}
				height={yScale.range()[0] - yScale.range()[1]}
			/>
		{/if}
	</svg>
</div>

<style>
	svg {
		stroke-width: 1px;
		stroke: #111;
		fill: none;
	}
	:global(.dark) svg {
		stroke: #ddd;
	}
	.zero {
		stroke-width: 4px;
	}
	.series line {
		stroke-width: 4px;
		stroke-linecap: round;
	}
	.stage rect {
		transition: opacity 100ms ease-in;
		fill: #111;
		opacity: 0;
	}
	:global(.dark) .stage rect {
		fill: #ddd;
	}
	.stage rect:hover {
		transition: opacity 100ms ease-out;
		opacity: 0.2;
	}
	.axis line {
		stroke-linecap: round;
		stroke-dasharray: 2;
	}
	.y-axis text {
		font-size: 0.8em;
		stroke-width: 1px;
		text-anchor: end;
	}
</style>
