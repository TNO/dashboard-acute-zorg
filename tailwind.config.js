module.exports = {
    theme: {
        extend: {},
        fontFamily: {
            sans: ['Roboto', 'sans-serif']
        },
        backgroundSize: {
            'auto': 'auto',
            'cover': 'cover',
            'contain': 'contain',
            '100%': '100%',
            '16': '4rem',
        }
    },
    plugins: [],
    content: [
        "./src/**/*.{js,jsx,ts,tsx,html}",
        "./public/index.html",
    ],
};