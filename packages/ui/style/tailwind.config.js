const tailwindcssAnimate = require('tailwindcss-animate');
const {
	default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
const tailwindConfig = (app) => ({
	darkMode: 'class',
	content: {

		files: [
			'./src/**/*.{ts,tsx,jsx,js}',
			'../src/**/*.{ts,tsx,jsx,js}',
			`../../apps/${app}/src/**/*.{ts,tsx,html,jsx,js}`,
			'../../packages/*/src/**/*.{ts,tsx,html,jsx,js}',
			'**/**/.{ts,tsx,html,stories.tsx,jsx,js}',
		]
	},
	theme: {
		container: {
			center: true,
			padding: '4rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			backgroundColor: {
				'beige-100': 'var(--color-beige-100)',
				'beige-200': 'var(--color-beige-200)',
				'darkgreen-500': 'var(--color-darkgreen-500)',
			},
			textColor: {
				'darkgreen-500': 'var(--color-darkgreen-500)',
				'beige-200': 'var(--color-beige-200)',
				'almost-black': 'var(--color-almost-black)',
			},
			borderColor: {
				'darkgreen-500': 'var(--color-darkgreen-500)',
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					'spinach-green': 'var(--color-spinach-green)',
					'cucumber-green': 'var(--color-cucumber-green)',
					'lime-green': 'var(--color-lime-green)',
					'off-white': 'var(--color-off-white)',
					'almost-black': 'var(--color-almost-black)',
					'almost-black-light': 'var(--color-almost-black-light)',
					'spinach-green-darker': 'var(--color-spinach-green-darker)',
					'cucumber-green-darker': 'var(--color-cucumber-green-darker)',
					'lime-green-darker': 'var(--color-lime-green-darker)',
					'off-white-darker': 'var(--color-off-white-darker)',
					'almost-black-darker': 'var(--color-almost-black-darker)',
					'spinach-green-lighter': 'var(--color-spinach-green-lighter)',
					'light-cyan-blue': 'var(--color-light-cyan-blue)',
					cucumberGreen: 'var(--color-cucumber-green)',
					limeGreen: 'var(--color-lime-green)',
					offWhite: 'var(--color-off-white)',
					almostBlack: 'var(--color-almost-black)',
					spinachGreenDarker: 'var(--color-spinach-green-darker)',
					cucumberGreenDarker: 'var(--color-cucumber-green-darker)',
					limeGreenDarker: 'var(--color-lime-green-darker)',
					offWhiteDarker: 'var(--color-off-white-darker)',
					almostBlackDarker: 'var(--color-almost-black-darker)',
					spinachGreenLighter: 'var(--color-spinach-green-lighter)',
					lightCyanBlue: 'var(--color-light-cyan-blue)',
					spinachGreen: 'var(--color-spinach-green)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					'corn-yellow': 'var(--color-corn-yellow)',
					'pink-salmon': 'var(--color-pink-salmon)',
					'creamer-beige': 'var(--color-creamer-beige)',
					'peach-orange': 'var(--color-peach-orange)',
					'peach-orange-lighter': 'var(--color-peach-orange-lighter)',
					'peach-orange-lightest': 'var(--color-peach-orange-lightest)',
					cornYellow: 'var(--color-corn-yellow)',
					pinkSalmon: 'var(--color-pink-salmon)',
					creamerBeige: 'var(--color-creamer-beige)',
					peachOrange: 'var(--color-peach-orange)',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			screens: {
				xs: '475px',
				sm: '650px',
				md: '868px',
				lg: '1024px',
				xl: '1280px',
				'2xl': '1440px',
			},
			fontSize: {
				tiny: 'var(--font-size-tiny)',
				xxs: 'var(--font-size-xxs)',
				xs: 'var(--font-size-xs)',
				sm: 'var(--font-size-sm)',
				base: 'var(--font-size-base)',
				lg: 'var(--font-size-lg)',
				xl: 'var(--font-size-xl)',
				'2xl': 'var(--font-size-2xl)',
				'3xl': 'var(--font-size-3xl)',
				'4xl': 'var(--font-size-4xl)',
				'5xl': 'var(--font-size-5xl)',
				'6xl': 'var(--font-size-6xl)',
				'7xl': 'var(--font-size-7xl)',
			},
			fontFamily: {
				righteous: ['var(--font-family-righteous)', 'd'],
				sans: ['var(--font-family-secondary)', 's'],
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)',
			},
			spacing: {
				'8': '2rem',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				blink: {
					'0%, 100%': { opacity: 1 },
					'50%': { opacity: 0 },
				},
				meteor: {
					"0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
					"70%": { opacity: "1" },
					"100%": {
						transform: "rotate(215deg) translateX(-500px)",
						opacity: "0",
					},
				},
				popUp: {
					'0%': { transform: 'translateY(100%)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				blink: 'blink 1s infinite',
				"meteor-effect": "meteor 5s linear infinite",
				popUp: 'popUp 0.5s ease forwards',
			},
			boxShadow: {
				input: `0px 2px 3px -1px rgba(0,0,0,0.1), 0px 1px 0px 0px rgba(25,28,33,0.02), 0px 0px 0px 1px rgba(25,28,33,0.08)`,
			},
		},
	},
	plugins: [
		tailwindcssAnimate,
		addVariablesForColors,
	],
});

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }) {
	let allColors = flattenColorPalette(theme("colors"));
	let newVars = Object.fromEntries(
		Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
	);

	addBase({
		":root": newVars,
	});
}

// Export the configuration function for use elsewhere
module.exports = tailwindConfig;
module.exports.tailwindConfig = tailwindConfig; // Optional: This line is for clearer named exports if needed.