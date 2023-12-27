import type { Room } from '$lib/room';

export async function fetchRooms(_fetch = fetch) {
	const response = await _fetch('/api/rooms');
	const data: Room[] = await response.json();
	return data;
}

type RoomAction = 'start' | 'stop' | 'pause' | 'add' | 'skip' | 'reset';
export async function requestAction(
	_fetch = fetch,
	room: string,
	action: RoomAction,
	requestData: any = undefined
) {
	let response = await _fetch(`/api/rooms/${room}/request`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(requestData ? { action, ...requestData } : { action })
	});
	response = await response.json();
	return response;
}
