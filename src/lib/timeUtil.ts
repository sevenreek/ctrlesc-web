export function getElapsedSeconds(startedOnDate?: string | Date | null) {
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

function humanizeDuration(seconds: number) {
	function numberEnding(number: number) {
		return number > 1 ? 's' : '';
	}
	var temp = Math.floor(seconds);
	var years = Math.floor(temp / 31536000);
	if (years) {
		return years + ' year' + numberEnding(years);
	}
	//TODO: Months! Maybe weeks?
	var days = Math.floor((temp %= 31536000) / 86400);
	if (days) {
		return days + ' day' + numberEnding(days);
	}
	var hours = Math.floor((temp %= 86400) / 3600);
	if (hours) {
		return hours + ' hour' + numberEnding(hours);
	}
	var minutes = Math.floor((temp %= 3600) / 60);
	if (minutes) {
		return minutes + ' minute' + numberEnding(minutes);
	}
	var seconds = temp % 60;
	if (seconds) {
		return seconds + ' second' + numberEnding(seconds);
	}
	return 'less than a second'; //'just now' //or other string you like;
}
