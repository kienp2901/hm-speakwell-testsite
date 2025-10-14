/* eslint-disable @typescript-eslint/no-var-requires */
const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      ...colors,
      // Color system from lms-ican project
      'ct-primary-100': '#EBFAFE',
      'ct-primary-200': '#99EAFF',
      'ct-primary-300': '#3DD1F7',
      'ct-primary-400': '#1294F2',
      'ct-primary-500': '#0056A4',
      'ct-primary-600': '#00376E',
      'ct-primary-700': '#002C58',
      'ct-primary-800': '#002347',
      'ct-primary-900': '#001C38',

      'ct-secondary-100': '#FFCDEB',
      'ct-secondary-200': '#FF65C1',
      'ct-secondary-300': '#FF58C2',
      'ct-secondary-400': '#FF58C2',
      'ct-secondary-500': '#FF3BAF',
      'ct-secondary-600': '#D9218E',
      'ct-secondary-700': '#CC2F8C',
      'ct-secondary-800': '#A32670',
      'ct-secondary-900': '#831E5A',
      'ct-secondary-1000': '#681848',

      'ct-green-100': '#5ABB10',

      'ct-tertiary-100': '#E4FF7E',
      'ct-tertiary-200': '#D0FF72',
      'ct-tertiary-300': '#BDFF68',
      'ct-tertiary-400': '#ACF75F',
      'ct-tertiary-500': '#9CE156',
      'ct-tertiary-600': '#7DB445',
      'ct-tertiary-700': '#649037',
      'ct-tertiary-800': '#50732C',
      'ct-tertiary-900': '#405C23',

      'ct-neutral-100': '#FAFCFE',
      'ct-neutral-200': '#E2EBF3',
      'ct-neutral-300': '#C7D6E6',
      'ct-neutral-400': '#B5C7D9',
      'ct-neutral-500': '#7893B0',
      'ct-neutral-600': '#2F4E74',
      'ct-neutral-700': '#2F4E74',
      'ct-neutral-800': '#213650',
      'ct-neutral-900': '#152B47',

      'ct-red-300': '#FF5A5A',
      'ct-red-400': '#DD405F',
      'ct-red-500': '#EF4444',
      'ct-red-600': '#FF2626',
      'ct-red-700': '#FF4545',

      'ct-true': '#009521',
      'ct-fail': '#FF2323',

      // Keep existing colors from hm-speakwell project
      primary: '#30A1E2',
      primary1: '#1D96EE',
      secondary: '#FF9B27',
      neutral: '#3C4B65',
      support_Blue: '#E9F5FC'
    },
    extend: {
      fontFamily: {
        'be-vietnam': ['Be Vietnam Pro', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        mikako: ["Mikado", "sans-serif"],
        mikakoBold: ["MikadoBold", "sans-serif"]
      },
      screens: {
        ipad1: '1075px',
        ipad2: '1110px',
        ipad3: '1160px',
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '4096px',
      },
      dropShadow: {
        df: '0px 5px 10px 0px #F1F2FA',
      },
      minHeight: {
        'screen-75': '75vh',
      },
      fontSize: {
        55: '55rem',
      },
      opacity: {
        80: '.8',
      },
      zIndex: {
        2: 2,
        3: 3,
      },
      inset: {
        '-100': '-100%',
        '-225-px': '-225px',
        '-160-px': '-160px',
        '-150-px': '-150px',
        '-94-px': '-94px',
        '-50-px': '-50px',
        '-29-px': '-29px',
        '-20-px': '-20px',
        '25-px': '25px',
        '40-px': '40px',
        '95-px': '95px',
        '145-px': '145px',
        '195-px': '195px',
        '210-px': '210px',
        '260-px': '260px',
      },
      height: {
        '95-px': '95px',
        '70-px': '70px',
        '350-px': '350px',
        '500-px': '500px',
        '600-px': '600px',
      },
      maxHeight: {
        '860-px': '860px',
      },
      maxWidth: {
        '100-px': '100px',
        '120-px': '120px',
        '150-px': '150px',
        '180-px': '180px',
        '200-px': '200px',
        '210-px': '210px',
        '580-px': '580px',
      },
      minWidth: {
        '140-px': '140px',
        48: '12rem',
      },
      backgroundSize: {
        full: '100%',
      },
      backgroundImage: {
        login:
          'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMDI0IiB2aWV3Qm94PSIwIDAgMTQ0MCAxMDI0IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg0KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzQ3Ml8xNDU4MikiPg0KPHJlY3Qgd2lkdGg9IjE0NDAiIGhlaWdodD0iMTAyNCIgZmlsbD0iI0RGRjJGRiIvPg0KPGVsbGlwc2UgY3g9IjM3OSIgY3k9Ijg1MSIgcng9IjQ4MyIgcnk9IjQ0OSIgZmlsbD0iIzAwNjdDNSIgZmlsbC1vcGFjaXR5PSIwLjEiLz4NCjxlbGxpcHNlIGN4PSIxMDQ5IiBjeT0iMjQwIiByeD0iNTEwIiByeT0iNDc0IiBmaWxsPSIjOENDNEY3IiBmaWxsLW9wYWNpdHk9IjAuMSIvPg0KPC9nPg0KPGRlZnM+DQo8Y2xpcFBhdGggaWQ9ImNsaXAwXzQ3Ml8xNDU4MiI+DQo8cmVjdCB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSIxMDI0IiBmaWxsPSJ3aGl0ZSIvPg0KPC9jbGlwUGF0aD4NCjwvZGVmcz4NCjwvc3ZnPg0K)',
      },
      cursor: {
        eraser:
          'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjEuMDMgMjJoLTcuMDRhLjc0OS43NDkgMCAxIDEgMC0xLjVoNy4wNGEuNzQ5Ljc0OSAwIDEgMSAwIDEuNVpNMTMuNjQgMTYuNjljLjM5LjM5LjM5IDEuMDIgMCAxLjQybC0yLjk4IDIuOThhMy4wMjcgMy4wMjcgMCAwIDEtNC4wNy4xOGMtLjA3LS4wNi0uMTMtLjEyLS4xOS0uMThsLS44Ny0uODctMS43OS0xLjc5LS44Ni0uODZjLS4wNy0uMDctLjEzLS4xNC0uMTktLjIxYTMuMDEgMy4wMSAwIDAgMSAuMTktNC4wNGwyLjk4LTIuOThhLjk5Ni45OTYgMCAwIDEgMS40MSAwbDYuMzcgNi4zNVpNMjEuMTIgMTAuNjQxbC01IDVhLjk5Ni45OTYgMCAwIDEtMS40MSAwbC02LjM3LTYuMzVjLS4zOS0uMzktLjM5LTEuMDIgMC0xLjQybDUtNC45OWEzLjAyNCAzLjAyNCAwIDAgMSA0LjI2IDBsMy41MiAzLjUxYTMuMDEyIDMuMDEyIDAgMCAxIDAgNC4yNVoiIGZpbGw9IiMwMDY3YzUiPjwvcGF0aD48L3N2Zz4=), auto',
        yellow:
          'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjEuODEgMy45MzhjLTEuMzEgMy4yNy00LjMgNy41NC03LjE1IDEwLjMzYTUuOTYyIDUuOTYyIDAgMCAwLTUuMDctNC45NmMyLjgtMi44NiA3LjEtNS44OSAxMC4zOC03LjIxLjU4LS4yMiAxLjE2LS4wNSAxLjUyLjMxLjM4LjM4LjU2Ljk1LjMyIDEuNTNaIiBmaWxsPSIjZmZlMjQ4Ij48L3BhdGg+PHBhdGggZD0iTTEzLjc4IDE1LjA5Yy0uMi4xNy0uNC4zNC0uNi41bC0xLjc5IDEuNDNjMC0uMDMtLjAxLS4wNy0uMDEtLjExLS4xNC0xLjA3LS42NC0yLjA2LTEuNDUtMi44N2E1LjAyOSA1LjAyOSAwIDAgMC0yLjk2LTEuNDZjLS4wMyAwLS4wNy0uMDEtLjEtLjAxbDEuNDUtMS44M2MuMTQtLjE4LjI5LS4zNS40NS0uNTNsLjY4LjA5YzIuMTUuMyAzLjg4IDEuOTkgNC4yMiA0LjEzbC4xMS42NloiIGZpbGw9IiNmZmUyNDgiPjwvcGF0aD48cGF0aCBkPSJNMTAuNDMgMTcuNjJjMCAxLjEtLjQyIDIuMTUtMS4yMiAyLjk0LS42MS42Mi0xLjQzIDEuMDQtMi40MyAxLjE2bC0yLjQ1LjI3Yy0xLjM0LjE1LTIuNDktMS0yLjM0LTIuMzVsLjI3LTIuNDZjLjI0LTIuMTkgMi4wNy0zLjU5IDQuMDEtMy42My4xOS0uMDEuNCAwIC42LjAyLjg1LjExIDEuNjcuNSAyLjM2IDEuMTguNjcuNjcgMS4wNSAxLjQ2IDEuMTYgMi4yOS4wMi4yLjA0LjM5LjA0LjU4WiIgZmlsbD0iI2ZmZTI0OCI+PC9wYXRoPjwvc3ZnPg==), auto',
        green:
          'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjEuODEgMy45MzhjLTEuMzEgMy4yNy00LjMgNy41NC03LjE1IDEwLjMzYTUuOTYyIDUuOTYyIDAgMCAwLTUuMDctNC45NmMyLjgtMi44NiA3LjEtNS44OSAxMC4zOC03LjIxLjU4LS4yMiAxLjE2LS4wNSAxLjUyLjMxLjM4LjM4LjU2Ljk1LjMyIDEuNTNaIiBmaWxsPSIjMGQ5NjFiIj48L3BhdGg+PHBhdGggZD0iTTEzLjc4IDE1LjA5Yy0uMi4xNy0uNC4zNC0uNi41bC0xLjc5IDEuNDNjMC0uMDMtLjAxLS4wNy0uMDEtLjExLS4xNC0xLjA3LS42NC0yLjA2LTEuNDUtMi44N2E1LjAyOSA1LjAyOSAwIDAgMC0yLjk2LTEuNDZjLS4wMyAwLS4wNy0uMDEtLjEtLjAxbDEuNDUtMS44M2MuMTQtLjE4LjI5LS4zNS40NS0uNTNsLjY4LjA5YzIuMTUuMyAzLjg4IDEuOTkgNC4yMiA0LjEzbC4xMS42NloiIGZpbGw9IiMwZDk2MWIiPjwvcGF0aD48cGF0aCBkPSJNMTAuNDMgMTcuNjJjMCAxLjEtLjQyIDIuMTUtMS4yMiAyLjk0LS42MS42Mi0xLjQzIDEuMDQtMi40MyAxLjE2bC0yLjQ1LjI3Yy0xLjM0LjE1LTIuNDktMS0yLjM0LTIuMzVsLjI3LTIuNDZjLjI0LTIuMTkgMi4wNy0zLjU5IDQuMDEtMy42My4xOS0uMDEuNCAwIC42LjAyLjg1LjExIDEuNjcuNSAyLjM2IDEuMTguNjcuNjcgMS4wNSAxLjQ2IDEuMTYgMi4yOS4wMi4yLjA0LjM5LjA0LjU4WiIgZmlsbD0iIzBkOTYxYiI+PC9wYXRoPjwvc3ZnPg==), auto',
        blue: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMjEuODEgMy45MzhjLTEuMzEgMy4yNy00LjMgNy41NC03LjE1IDEwLjMzYTUuOTYyIDUuOTYyIDAgMCAwLTUuMDctNC45NmMyLjgtMi44NiA3LjEtNS44OSAxMC4zOC03LjIxLjU4LS4yMiAxLjE2LS4wNSAxLjUyLjMxLjM4LjM4LjU2Ljk1LjMyIDEuNTNaIiBmaWxsPSIjMThhNGQwIj48L3BhdGg+PHBhdGggZD0iTTEzLjc4IDE1LjA5Yy0uMi4xNy0uNC4zNC0uNi41bC0xLjc5IDEuNDNjMC0uMDMtLjAxLS4wNy0uMDEtLjExLS4xNC0xLjA3LS42NC0yLjA2LTEuNDUtMi44N2E1LjAyOSA1LjAyOSAwIDAgMC0yLjk2LTEuNDZjLS4wMyAwLS4wNy0uMDEtLjEtLjAxbDEuNDUtMS44M2MuMTQtLjE4LjI5LS4zNS40NS0uNTNsLjY4LjA5YzIuMTUuMyAzLjg4IDEuOTkgNC4yMiA0LjEzbC4xMS42NloiIGZpbGw9IiMxOGE0ZDAiPjwvcGF0aD48cGF0aCBkPSJNMTAuNDMgMTcuNjJjMCAxLjEtLjQyIDIuMTUtMS4yMiAyLjk0LS42MS42Mi0xLjQzIDEuMDQtMi40MyAxLjE2bC0yLjQ1LjI3Yy0xLjM0LjE1LTIuNDktMS0yLjM0LTIuMzVsLjI3LTIuNDZjLjI0LTIuMTkgMi4wNy0zLjU5IDQuMDEtMy42My4xOS0uMDEuNCAwIC42LjAyLjg1LjExIDEuNjcuNSAyLjM2IDEuMTguNjcuNjcgMS4wNSAxLjQ2IDEuMTYgMi4yOS4wMi4yLjA0LjM5LjA0LjU4WiIgZmlsbD0iIzE4YTRkMCI+PC9wYXRoPjwvc3ZnPg==), auto',
        comment:
          'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIj48cGF0aCBkPSJNMTYgMkg4QzQgMiAyIDQgMiA4djEzYzAgLjU1LjQ1IDEgMSAxaDEzYzQgMCA2LTIgNi02VjhjMC00LTItNi02LTZabS0yIDEzLjI1SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWg3Yy40MSAwIC43NS4zNC43NS43NXMtLjM0Ljc1LS43NS43NVptMy01SDdjLS40MSAwLS43NS0uMzQtLjc1LS43NXMuMzQtLjc1Ljc1LS43NWgxMGMuNDEgMCAuNzUuMzQuNzUuNzVzLS4zNC43NS0uNzUuNzVaIiBmaWxsPSIjMDA1NmE0Ij48L3BhdGg+PC9zdmc+), auto',
      },
    },
  },
  variants: [
    'responsive',
    'group-hover',
    'focus-within',
    'first',
    'last',
    'odd',
    'even',
    'hover',
    'focus',
    'active',
    'visited',
    'disabled',
  ],
  plugins: [
    require('@tailwindcss/line-clamp'),
    plugin(function ({ addComponents, theme }) {
      const screens = theme('screens', {});
      addComponents([
        {
          '.container': { width: '100%' },
        },
        {
          [`@media (min-width: ${screens.ssm})`]: {
            '.container': {
              'max-width': '640px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.sm})`]: {
            '.container': {
              'max-width': '640px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.md})`]: {
            '.container': {
              'max-width': '768px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.lg})`]: {
            '.container': {
              'max-width': '1024px',
            },
          },
        },
        {
          [`@media (min-width: ${screens.xl})`]: {
            '.container': {
              'max-width': '1280px',
            },
          },
        },
        {
          [`@media (min-width: ${screens['2xl']})`]: {
            '.container': {
              'max-width': '1280px',
            },
          },
        },
        {
          '.shadow': {
            boxShadow: '4px 4px 13px #828282',
          },
        },
        {
          '.translate': {
            transform: 'scale(2)',
            transitionDuration: '1.5s',
          },
        },
      ]);
    }),
  ],
};
