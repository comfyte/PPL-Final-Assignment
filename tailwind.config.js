module.exports = {
    purge: ["./**/*.{tsx,jsx,html}"],
    darkMode: false,
    theme: {
        extend: {
            zIndex: { '-1': '-1' }
        },
    },
    variants: {
        extend: {
            backgroundColor: ["active", "checked"],
            translate: ["group-hover"],
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography")
    ]
}
