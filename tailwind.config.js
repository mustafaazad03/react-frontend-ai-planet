/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			boxShadow: {
				nav: "0px -8px 25px 0px rgba(0, 0, 0, 0.22)",
				input: "0px 4px 30px 0px rgba(102, 102, 102, 0.10)",
			},
			colors: {
				primary: "#0FA958",
			},
			fontFamily: {
				inter: ["Inter", "sans-serif"],
			},
		},
	},
	plugins: [],
};
