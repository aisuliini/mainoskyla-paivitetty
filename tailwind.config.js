module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    { pattern: /^(bg|hover:bg)-(minttu|minttu-dark|persikka|persikka-dark|charcoal|cream|beige)$/ }
  ],
  theme: {
    extend: {
      fontFamily: {
  sans: ['Rubik', 'sans-serif'],
}


,
      colors: {
        minttu: '#A9DCD2',
        'minttu-dark': '#4ABDAC',
        persikka: '#F5B3A7',
        'persikka-dark': '#E86E5B',
        charcoal: '#2C3E3D',
        cream: '#F7F9F9',
        white: '#FFFFFF', 


      },
    },
  },
}
