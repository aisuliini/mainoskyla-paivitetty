// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    +    { pattern: /^(bg|hover:bg)-(minttu|minttu-dark|persikka|persikka-dark|charcoal|cream)$/ }
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans','Inter','sans-serif'],
      },
      colors: {
        minttu:       '#70D6C7',
        'minttu-dark': '#4ABDAC',
        'persikka-dark':'#E86E5B',
        persikka:     '#F99584',
        charcoal:     '#1E3A41',
        cream:        '#F7F9F9',
      },
    },
  },
}
