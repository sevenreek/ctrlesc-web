import type { PageLoad } from './$types';
import type { Room } from '$lib/room';

export const load: PageLoad = async ({ fetch, params }) => {
	const stateResponse = await fetch(`/api/rooms/${params.slug}`);
	const room = (await stateResponse.json()) as Room;
	return { room };
};
