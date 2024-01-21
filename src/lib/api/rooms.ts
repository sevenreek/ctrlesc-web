import type { Room, TimerState } from '$lib/room';
import type { components } from '$lib/api/types';
import type { Writable } from 'svelte/store';

export type RequestResult = components['schemas']['RequestResult'];

export async function fetchRooms(_fetch = fetch) {
	const response = await _fetch('/api/rooms');
	const data: Room[] = await response.json();
	return data;
}

export const ROOM_CONTEXT = Symbol();
export const ROOM_STATE_CONTEXT = Symbol();
export const STAGE_CONTEXT = Symbol();
export type RoomStateContext = { activeStage: number; state: TimerState };
export type StageContext = { index: number };
export type RoomAction = 'start' | 'stop' | 'pause' | 'add' | 'skip' | 'reset';
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
	return response as RequestResult;
}
