import type { RoomOverview } from '$lib/room';

export async function fetchRoomOverviews(ffetch = fetch) {
	const response = await ffetch('/api/rooms/');
	const rooms = (await response.json()) as RoomOverview[];
	return rooms;
}
