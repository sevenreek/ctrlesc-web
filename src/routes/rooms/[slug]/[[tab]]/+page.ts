import type { PageLoad } from './$types';
import type { Room } from '$lib/room';
import type { TabID } from './tabs/types';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const [stateResponse, segmentsResponse] = await Promise.all([
		fetch(`/api/rooms/${encodeURIComponent(params.slug)}`),
		fetch(`/api/rooms/${encodeURIComponent(params.slug)}/segments`)
	]);
	const room = (await stateResponse.json()) as Room;
	const compareSegments = (await segmentsResponse.json()) as Record<string, number[]>;
	return { room, compareSegments, url };
};
