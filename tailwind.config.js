// tailwind.config.js
module.exports = {
  //darkMode: 'class', // or 'media' if you prefer automatic
  darkMode: 'media', // auto detects based on system
  content: [
    "./src/**/*.{html,ts}", // Adjust for Ionic + Angular
    "./node_modules/@ionic/angular/**/*.js", // Include Ionic components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};


