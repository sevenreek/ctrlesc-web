let sse: EventSource | undefined = undefined;

type BaseSSEUpdate = {
	room: string;
	stage: string;
	puzzle: string;
};
export type StateSSEUpdate = BaseSSEUpdate & { state: any };
export type CompletionSSEUpdate = BaseSSEUpdate & { completed: boolean };
export type SSEUpdate = StateSSEUpdate | CompletionSSEUpdate;

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
