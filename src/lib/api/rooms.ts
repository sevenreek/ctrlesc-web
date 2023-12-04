import type { Room } from '$lib/room';

export async function fetchRooms(_fetch = fetch) {
	const response = await _fetch('/api/rooms');
	const data: Room[] = await response.json();
	return data;
}
