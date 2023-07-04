import type {PageLoad} from './$types';

export const load: PageLoad = async({fetch}) => {
	const response = await fetch("/api/rooms/");
	const rooms = await response.json() as RoomDisplay[];
	return {rooms};
}
