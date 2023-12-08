/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			transitionProperty: {
				width: 'width'
			},
			fontFamily: {
				default: ['Gabarito', 'sans-serif']
			}
		}
	},
	plugins: [require('daisyui')],

	daisyui: {
		themes: [
			{
				uad_light: {
					primary: '#5DA9DD',
					secondary: '#013E7B',
					accent: '#01647A',
					neutral: '#6b7280',
					'base-100': '#FDFDFD',
					info: '#00b5ff',
					success: '#84cc16',
					warning: '#fb923c',
					error: '#ef4444'
				},
				uad_dark: {
					primary: '#5DA9DD',
					secondary: '#013E7B',
					accent: '#01647A',
					neutral: '#6b7280',
					'base-100': '#151515',
					info: '#00b5ff',
					success: '#84cc16',
					warning: '#fb923c',
					error: '#ef4444'
				}
			}
		], // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
		darkTheme: 'uad_dark', // name of one of the included themes for dark mode
		base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
		utils: true, // adds responsive and modifier utility classes
		rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to contentWizard dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
		prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
		logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
		themeRoot: ':root' // The element that receives theme color CSS variables
	}
};
