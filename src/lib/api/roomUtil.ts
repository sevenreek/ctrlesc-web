import type { RoomDetail } from '$lib/room';

export function getRoomMaxCompletion(room: RoomDetail) {
	return room.stages.reduce((stageAcc, stage) => {
		return (
			stageAcc +
			stage.puzzles.reduce((puzzleAcc, puzzle) => (puzzleAcc += puzzle.completionWorth), 0)
		);
	}, 0);
}
