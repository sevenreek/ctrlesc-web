import type {PageLoad} from './$types';
import type { RoomDisplay } from '$lib/Room';

export const load: PageLoad = async({fetch}) => {
	const response = await fetch("/api/rooms/");
	const rooms = await response.json() as RoomDisplay[];
	return {rooms};
}
