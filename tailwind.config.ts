import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff8e1',
                    100: '#ffecb3',
                    200: '#ffe082',
                    300: '#ffd54f',
                    400: '#ffca28',
                    500: '#ffc107', // Amber 500
                    600: '#ffb300',
                    700: '#ffa000',
                    800: '#ff8f00',
                    900: '#ff6f00',
                    DEFAULT: '#ffc107',
                },
                secondary: {
                    50: '#efebe9',
                    100: '#d7ccc8',
                    200: '#bcaaa4',
                    300: '#a1887f',
                    400: '#8d6e63',
                    500: '#795548', // Brown 500
                    600: '#6d4c41',
                    700: '#5d4037',
                    800: '#4e342e',
                    900: '#3e2723',
                    DEFAULT: '#795548',
                },
            },
            fontFamily: {
                sans: ['var(--font-geist-sans)'],
                mono: ['var(--font-geist-mono)'],
            },
        },
    },
    plugins: [],
};
export default config;
