import type { TimerState } from '$lib/room';

let sse: EventSource | undefined = undefined;

type BaseRoomSSEUpdate = {
	room: string;
};
type BasePuzzleSSEUpdate = BaseRoomSSEUpdate & {
	stage: string;
	puzzle: string;
};
export type RoomStateSSEUpdate = BaseRoomSSEUpdate & {
	update: {
		state?: TimerState;
		activeStage?: number | null;
		timeElapsedOnPause: number;
		startTimestamp: string | null;
		extraTime: number;
	};
};
export type PuzzleStateSSEUpdate = BasePuzzleSSEUpdate & { update: { state: any } };
export type PuzzleCompletionSSEUpdate = BasePuzzleSSEUpdate & { update: { completed: boolean } };
export type SSEUpdate = PuzzleStateSSEUpdate | PuzzleCompletionSSEUpdate | RoomStateSSEUpdate;

export type SSEListener = (data: SSEUpdate) => void;
type EventType = MessageEvent<string>;

export function addListener(listener: SSEListener): (evt: EventType) => void {
	if (sse === undefined) sse = new EventSource('/api/rooms/sse');
	const registeredCallback = (evt: EventType) => {
		const updateData = JSON.parse(evt.data);
		listener(updateData);
	};
	sse.addEventListener('update', registeredCallback);
	return registeredCallback;
}

export function removeListener(registeredCallback: (evt: EventType) => void) {
	(sse as EventSource).removeEventListener('update', registeredCallback);
}
