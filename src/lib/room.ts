import type { components } from './api/types';

export type RoomDetail = components['schemas']['RoomDetail'];
export type RoomOverview = components['schemas']['RoomOverview'];
export type Puzzle = components['schemas']['Puzzle'];
export type Stage = components['schemas']['Stage'];
export type TimerState = components['schemas']['TimerState'];
type UpdateData = { state?: any; completed?: boolean };

export function updateRoomStage(
	stages: Stage[],
	data: UpdateData,
	stageSlug: string,
	puzzleSlug: string
) {
	const stage = stages.find((s) => s.slug === stageSlug);
	if (!stage) throw Error(`${stageSlug} not found.`);
	const puzzleIndex = stage.puzzles.findIndex((p) => p.slug === puzzleSlug);
	const puzzle = stage.puzzles[puzzleIndex];
	if (!puzzle) throw Error(`${stageSlug}/${puzzleSlug} not found.`);
	if (data.state !== undefined) {
		puzzle.state = data['state'];
	} else if (data['completed'] !== undefined) {
		puzzle.completed = data['completed'];
	}
	stage.puzzles[puzzleIndex].state = { ...puzzle.state };
	return stages;
}
