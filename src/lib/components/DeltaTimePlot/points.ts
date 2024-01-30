import { getDeltaColors } from './colors';
export type Point = { x: number; y: number };
export function getX0(pointA: Point, pointB: Point) {
	// y = ax + b
	/*
		const a = (pointB.y - pointA.y) / (pointB.x - pointA.x);
		const b = a * pointA.x - pointA.y;
		return -b / a;
		*/
	const { x: x1, y: y1 } = pointA;
	const { x: x2, y: y2 } = pointB;
	return x1 - ((x1 - x2) / (y1 - y2)) * y1;
}
export type LineSegment = {
	x1: number;
	x2: number;
	y1: number;
	y2: number;
	lineColor: string;
	areaColor: string;
};
export function getLineSegments(pointA: Point, pointB: Point): LineSegment[] {
	if (Math.sign(pointA.y) == Math.sign(pointB.y)) {
		return [
			{
				x1: pointA.x,
				y1: pointA.y,
				x2: pointB.x,
				y2: pointB.y,
				...getDeltaColors(pointA.y, pointB.y)
			}
		];
	}
	const zeroCrossingX = getX0(pointA, pointB);

	return [
		{ x1: pointA.x, y1: pointA.y, x2: zeroCrossingX, y2: 0, ...getDeltaColors(pointA.y, 0) },
		{ x1: zeroCrossingX, y1: 0, x2: pointB.x, y2: pointB.y, ...getDeltaColors(0, pointB.y) }
	];
}
