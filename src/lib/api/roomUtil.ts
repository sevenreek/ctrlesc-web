import type { RoomDetail } from '$lib/Room';

export function getRoomMaxCompletion(room: RoomDetail) {
	return room.stages.reduce((stageAcc, stage) => {
		return (
			stageAcc +
			stage.puzzles.reduce((puzzleAcc, puzzle) => (puzzleAcc += puzzle.completionWorth), 0)
		);
	}, 0);
}
