import type {PageLoad} from './$types';
import type { RoomDetails, Puzzle, Stage } from '$lib/Room';

export const load: PageLoad = async({fetch, params}) => {
	const response = await fetch(`/api/rooms/${params.slug}`);
	const room = await response.json() as RoomDetails;
	return {room};
}
