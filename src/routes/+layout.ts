import type { LayoutLoad } from './$types';
import { fetchRoomOverviews } from '$lib/api/roomOverview';

export const load: LayoutLoad = async ({ fetch }) => {
	const rooms = await fetchRoomOverviews(fetch);
	return { rooms };
};
