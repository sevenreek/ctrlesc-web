import type { PageLoad } from './$types';
import { fetchRoomOverviews } from '$lib/api/roomOverview';

export const load: PageLoad = async ({ fetch }) => {
	const rooms = await fetchRoomOverviews(fetch);
	return { rooms };
};
