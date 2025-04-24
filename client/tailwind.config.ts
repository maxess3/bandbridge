import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			keyframes: {
				"loader-animation": {
					"0%": { transform: "translate(0px)" },
					"50%": { transform: "translate(128px)" },
					"100%": { transform: "translate(0px)" },
				},
			},
			animation: {
				"loader-animation": "loader-animation 1.8s infinite",
			},
			gridTemplateColumns: {
				"auto-fit": "repeat(auto-fit, minmax(10rem, 1fr))",
			},
			fontFamily: {
				satoshi: ["var(--font-satoshi)"],
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				dialog: {
					DEFAULT: "hsl(var(--dialog))",
				},
				hover: {
					DEFAULT: "hsl(var(--hover))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					hover: "hsl(var(--primary-hover))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					hover: "hsl(var(--secondary-hover))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: {
					DEFAULT: "hsl(var(--border))",
					light: "hsl(var(--border-light))",
					extralight: "hsl(var(--border-extralight))",
				},
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
		},
	},
	plugins: [tailwindcssAnimate],
} satisfies Config;
