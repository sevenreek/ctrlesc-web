import type { Room, Stage } from '$lib/room';

export function getRoomMaxCompletion(room: Room) {
	return getStagesMaxCompletion(room.stages);
}
export function getStagesMaxCompletion(stages: Stage[]) {
	return stages.reduce((stageAcc, stage) => {
		return stageAcc + getStageMaxCompletion(stage);
	}, 0);
}
export function getStageMaxCompletion(stage: Stage) {
	return stage.puzzles.reduce((puzzleAcc, puzzle) => (puzzleAcc += puzzle.completionWorth), 0);
}

export function getCurrentRoomCompletion(room: Room) {
	return getStagesCurrentCompletion(room.stages);
}

export function getStagesCurrentCompletion(stages: Stage[]) {
	return stages.reduce((stageAcc, stage) => {
		return stageAcc + getStageCurrentCompetion(stage);
	}, 0);
}

export function getStageCurrentCompetion(stage: Stage) {
	return stage.puzzles.reduce(
		(puzzleAcc, puzzle) => (puzzleAcc += puzzle.completed ? puzzle.completionWorth : 0),
		0
	);
}
