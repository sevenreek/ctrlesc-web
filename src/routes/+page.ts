import { fetchRooms } from '$lib/api/rooms';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const rooms = await fetchRooms(fetch);
	return { rooms };
};
