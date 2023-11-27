import type { PageLoad } from './$types';
import type { RoomDetail, Puzzle, Stage } from '$lib/room';

export const load: PageLoad = async ({ fetch, params }) => {
	const stateResponse = await fetch(`/api/rooms/${params.slug}`);
	const room = (await stateResponse.json()) as RoomDetail;
	return { room };
};
