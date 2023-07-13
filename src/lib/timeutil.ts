
	export function getElapsedSeconds(startedOnDate?: string | Date) {
		if (!startedOnDate) return undefined;
		return Math.floor((Date.now() - new Date(startedOnDate).getTime()) / 1000);
	}

	export function formatDuration(durationInSeconds?: number) {
		if (durationInSeconds == null) return '';
		let sign = '';
		if (durationInSeconds < 0) {
			durationInSeconds = Math.abs(durationInSeconds);
			sign = '-';
		}
		const seconds = durationInSeconds % 60;
		const minutes = Math.floor(durationInSeconds / 60) % 60;
		const hours = Math.floor(durationInSeconds / 3600);
		const formattedSeconds = String(seconds).padStart(2, '0');
		const formattedMinutes = hours
			? String(minutes).padStart(2, '0').concat(':')
			: String(minutes).concat(':');
		const formattedHours = hours ? String(hours).concat(':') : '';
		return `${sign}${formattedHours}${formattedMinutes}${formattedSeconds}`;
	}