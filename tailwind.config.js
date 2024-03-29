/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './views/*.ejs',
    './views/partials/*.ejs'
  ],
  theme: {
    extend: {
      width: {
        'main': '83.4vw',
      },
      height: {
        'main': '90vh',
      },
      background:{
        'main': 'rgb(11, 11, 66)'
      } 
    },
  },
  plugins: [],
}