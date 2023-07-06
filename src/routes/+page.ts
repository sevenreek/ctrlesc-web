import type {PageLoad} from './$types';
import type { RoomBase } from '$lib/Room';

export const load: PageLoad = async({fetch}) => {
	const response = await fetch("/api/rooms/");
	const rooms = await response.json() as RoomBase[];
	return {rooms};
}
