import { join } from 'path'
import skeleton from '@skeletonlabs/skeleton/tailwind/skeleton.cjs'

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			fontSize: {
				'3xs': ['0.5rem', '0.75rem'],
				'2xs': ['0.625rem','0.9375rem']
			}
		},

	},
	plugins: [...skeleton()],
}
