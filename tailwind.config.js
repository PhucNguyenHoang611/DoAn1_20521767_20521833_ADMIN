/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionProperty: {
        "width": "width",
        "height": "height",
      },
      colors: {
        "primary-0": "#886059",
        "primary-1": "#A67F78",
        "primary-2": "#B99A94",
        "primary-3": "#CCB5B1",
        "primary-4": "#DFD1CF",
        "primary-5": "#F2EDEC",
        "secondary-0": "#716864",
        "secondary-1": "#8F8681",
        "secondary-2": "#A69F9B",
        "secondary-3": "#BFB9B6",
        "secondary-4": "#D7D3D2",
        "secondary-5": "#EFEEED",
        "dark-0": "#273449",
        "dark-1": "#32435F",
        "dark-2": "#4C6791",
        "dark-3": "#768EB7",
        "dark-4": "#A9B9D2",
        "dark-5": "#DDE3ED",
        "light-0": "#B8ACA5",
        "light-1": "#E1DCD9",
        "light-2": "#E8E4E2",
        "light-3": "#EEECEA",
        "light-4": "#F5F3F2",
        "light-5": "#FBFAFA",
      },
      fontFamily: {
        "eb-garamond": ["EB Garamond", "serif"],
        "cormorant-garamond": ["Cormorant Garamond", "serif"],
      },
      screens: {
        "phone": "444px",
        // => @media (min-width: 640px) { ... }

        "phone-1": "516px",
        // => @media (min-width: 640px) { ... }

        "tablet": "640px",
        // => @media (min-width: 640px) { ... }
  
        "laptop": "1024px",
        // => @media (min-width: 1024px) { ... }
  
        "desktop": "1280px",
        // => @media (min-width: 1280px) { ... }
      },
    },
  },
  plugins: [],
}