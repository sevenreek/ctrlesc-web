import type { SSEUpdate } from './api/sse';
import type { components } from './api/types';

export type Room = components['schemas']['Room'];
export type RoomConfig = components['schemas']['RoomConfig'];
export type StageConfig = components['schemas']['StageConfig'];
export type DigitalStatePuzzle = components['schemas']['DigitalStatePuzzle'];
export type SequencePuzzle = components['schemas']['SequencePuzzle'];
export type SpeechDetectionPuzzle = components['schemas']['SpeechDetectionPuzzle'];
export type AnyPuzzle = DigitalStatePuzzle | SequencePuzzle | SpeechDetectionPuzzle;
export type Stage = components['schemas']['Stage'];
export type TimerState = components['schemas']['TimerState'];
type UpdateData = { state?: any; completed?: boolean };

export function updateRoom(room: Room, data: SSEUpdate) {
	let stage, puzzle;
	if (!('stage' in data)) {
		const { stages: stagesUpdateData, ...roomUpdateData } = data.update;
		room = { ...room, ...roomUpdateData };
		if (stagesUpdateData?.length === room.stages.length) {
			for (let stageIndex = 0; stageIndex < room.stages.length; stageIndex += 1) {
				const stage = room.stages[stageIndex];
				for (let puzzleIndex = 0; puzzleIndex < stage.puzzles.length; puzzleIndex += 1) {
					stage.puzzles[puzzleIndex] = {
						...stage.puzzles[puzzleIndex],
						...stagesUpdateData[stageIndex].puzzles[puzzleIndex]
					};
				}
			}
		}
		return room;
	}
	stage = room.stages.find((s) => s.slug === data.stage);
	if (!stage) throw Error(`${data.stage} not found in room ${room.slug}.`);
	if (!('puzzle' in data)) throw Error(`Stage updates not supported.`);
	const puzzleIndex = stage.puzzles.findIndex((p) => p.slug === data.puzzle);
	puzzle = stage.puzzles[puzzleIndex];
	stage.puzzles[puzzleIndex] = { ...puzzle, ...data.update };
	return room;
}

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
