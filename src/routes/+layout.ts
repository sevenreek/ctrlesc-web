import { fetchRooms } from '$lib/api/rooms';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ fetch }) => {
	const rooms = await fetchRooms(fetch);
	return { rooms };
};
