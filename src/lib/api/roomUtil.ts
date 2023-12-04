import type { Room } from '$lib/room';

export function getRoomMaxCompletion(room: Room) {
	return room.stages.reduce((stageAcc, stage) => {
		return (
			stageAcc +
			stage.puzzles.reduce((puzzleAcc, puzzle) => (puzzleAcc += puzzle.completionWorth), 0)
		);
	}, 0);
}
