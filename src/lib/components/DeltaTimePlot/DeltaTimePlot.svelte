<script lang="ts">
	import { getRandomInt } from '$lib/util/random';
	import * as d3 from 'd3';
	import { getContext, onMount } from 'svelte';
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import { svgTooltip } from '$lib/util/popup';
	import { nanoid } from 'nanoid';
	import { ROOM_CONTEXT } from '$lib/api/rooms';
	import type { RoomConfig } from '$lib/room';
	import { formatDuration } from '$lib/timeUtil';
	import { getLineSegments, type LineSegment } from './points';

	export let title = 'Delta Time';
	export let subtitle = 'vs. sum of best segments';
	export let colorArea = true;

	let room: RoomConfig = getContext(ROOM_CONTEXT);
	let svg: SVGElement;
	const STAGE_COUNT = room.stages.length;
	const INITIAL_LEFT_PADDING = 50;
	let width = 0;
	let height = 0;
	let elapsedTime = 0;
	let elapsedCompletion = 0;
	let xTickCount = 5;
	let yTickCount = 5;

	const randomTime = d3.randomInt(1 * 60, 10 * 60);
	const randomCompletion = d3.randomInt(3, 30);
	const randomDeltaTime = d3.randomInt(-7 * 60, 7 * 60);
	const mockAverage = (min: number, max: number) =>
		getRandomInt(min + (max - min) / 3, min + (2 * (max - min)) / 3);
	const zeroIfUndefined = (r?: number) => (r === undefined ? 0 : r);

	const baselineData = d3.range(STAGE_COUNT).map(() => randomTime());
	const data = d3.range(STAGE_COUNT).map((i) => baselineData[i] + randomDeltaTime());
	const deltaData = data.map((el, i) => el - baselineData[i]);
	const deltaCum = Array.from(d3.cumsum(deltaData));
	const stageCompletionTime = Array.from(d3.cumsum(d3.range(STAGE_COUNT).map(() => randomTime())));
	deltaCum.unshift(0);
	deltaData.unshift(0);
	stageCompletionTime.unshift(0);

	const yExtent = d3.nice(
		...(d3.extent(deltaCum).map(zeroIfUndefined) as [number, number]),
		yTickCount
	) as [number, number];
	const xExtent = d3.extent(stageCompletionTime.concat(elapsedCompletion)).map(zeroIfUndefined) as [
		number,
		number
	];
	let padding = { left: INITIAL_LEFT_PADDING, right: 10, top: 10, bottom: 40 };

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
	}
	$: tooltipData = {
		stageName: '',
		delta: 0,
		deltaCum: 0
	};
	const stagePopupId = nanoid();

	function getAreaPoints(lineSegment: LineSegment) {
		const points = [
			[lineSegment.x1, 0],
			[lineSegment.x2, 0],
			[lineSegment.x2, lineSegment.y2],
			[lineSegment.x1, lineSegment.y1]
		];
		return points
			.map((pnt) => xScale(pnt[0]).toString() + ',' + yScale(pnt[1]).toString())
			.join(' ');
	}
	$: lineSegments = deltaCum.flatMap((currentY, i) => {
		if (i == 0) return [];
		const prevX = stageCompletionTime[i - 1];
		const prevY = deltaCum[i - 1];
		const currentX = stageCompletionTime[i];
		const segments = getLineSegments({ x: prevX, y: prevY }, { x: currentX, y: currentY });
		return segments;
	});
</script>

<svelte:window on:resize={onResize} />

<div class="w-full h-72">
	<h2 class="text-center text-lg">{title}</h2>
	<h3 class="text-center text-sm">{subtitle}</h3>
	<div class="card p-2 variant-filled-surface absolute opacity-0" id={stagePopupId}>
		<h4 class="font-semibold text-sm">{tooltipData.stageName}</h4>
		<div class="grid grid-cols-2 text-xs p-1 gap-1">
			<span>Stage loss: </span><span>{formatDuration(tooltipData.delta)}</span>
			<span>Cumulative loss: </span><span>{formatDuration(tooltipData.deltaCum)}</span>
		</div>
		<div class="arrow variant-filled-secondary" />
	</div>
	{#if width === 0}
		<div class="flex justify-center items-center h-full">
			<ProgressRadial value={undefined} />
		</div>
	{/if}
	<svg bind:this={svg} class="w-full h-full">
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
						<polygon points={getAreaPoints(seg)} style="fill: {seg.areaColor}" class="opacity-10" />
					{/if}
				{/each}
			</g>
			<g class="stages">
				{#each stageCompletionTime as tick, index}
					<g class="stage">
						<!-- stage areas -->
						{#if index > 0}
							{@const prevTick = stageCompletionTime[index - 1]}
							<!-- svelte-ignore a11y-no-static-element-interactions -->
							<!-- svelte-ignore a11y-mouse-events-have-key-events -->
							<rect
								use:svgTooltip={{ target: stagePopupId, placement: 'bottom', offset: 4 }}
								on:mouseover={() => {
									tooltipData = {
										...tooltipData,
										stageName: room.stages[index - 1].name,
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
	}
	.border {
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
	.stage line {
		transition: stroke-width 200ms ease-in;
		stroke-width: 2px;
		pointer-events: all;
	}
	.stage line:hover {
		transition: stroke-width 200ms ease-out;
		stroke-width: 5px;
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
