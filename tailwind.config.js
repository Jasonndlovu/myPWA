// tailwind.config.js
module.exports = {
  //darkMode: 'class', // or 'media' if you prefer automatic
  darkMode: 'media', // auto detects based on system
  content: [
    "./src/**/*.{html,ts}", // Adjust for Ionic + Angular
    "./node_modules/@ionic/angular/**/*.js", // Include Ionic components
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
    },
  },
  plugins: [],
};


