type DeltaSigns = '-1-1' | '-10' | '-11' | '0-1' | '00' | '01' | '1-1' | '10' | '11';
export function getDeltaColors(y1: number, y2: number) {
	const colorMapping = {
		'11': {
			lineColor: 'rgba(var(--color-error-800) / 1)',
			areaColor: 'rgba(var(--color-error-600) / 1)'
		},
		'10': {
			lineColor: 'rgba(var(--color-error-600) / 1)',
			areaColor: 'rgba(var(--color-error-600) / 1)'
		},
		'1-1': {
			lineColor: 'rgba(var(--color-error-500) / 1)',
			areaColor: 'rgba(var(--color-error-600) / 1)'
		},
		'01': {
			lineColor: 'rgba(var(--color-error-800) / 1)',
			areaColor: 'rgba(var(--color-error-600) / 1)'
		},
		'00': {
			lineColor: 'rgba(var(--color-secondary-600) / 1)',
			areaColor: 'rgba(var(--color-secondary-600) / 1)'
		},
		'0-1': {
			lineColor: 'rgba(var(--color-success-600) / 1)',
			areaColor: 'rgba(var(--color-success-600) / 1)'
		},
		'-11': {
			lineColor: 'rgba(var(--color-success-800) / 1)',
			areaColor: 'rgba(var(--color-success-600) / 1)'
		},
		'-10': {
			lineColor: 'rgba(var(--color-success-600) / 1)',
			areaColor: 'rgba(var(--color-success-600) / 1)'
		},
		'-1-1': {
			lineColor: 'rgba(var(--color-success-500) / 1)',
			areaColor: 'rgba(var(--color-success-600) / 1)'
		}
	};
	const signs = (Math.sign(y1).toString() + Math.sign(y2 - y1).toString()) as DeltaSigns;
	return colorMapping[signs];
}
