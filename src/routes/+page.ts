import type { PageLoad } from './$types';
import type { RoomOverview } from '$lib/Room';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/api/rooms/');
	const rooms = (await response.json()) as RoomOverview[];
	return { rooms };
};
