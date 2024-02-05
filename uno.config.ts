import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  shortcuts: [
    [
      'btn',
      'px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    ],
    [
      'icon-btn',
      'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600',
    ],
  ],
  theme: {
    colors: {
      greenPrimary: '#71F6B2',
      redPrimary: '#EC3C5E',
      grayPrimary: '#AAAAAA',
      yellowPrimary: '#F6E225',
      bluePrimary: '#073146',
      graySecondary: '#323641',
      greenSecondary: '#39A895',
      purplePrimary: '#984DF7',
      redSecondary: '#E84142',
      yellowSecondary: '#F8C100',
      blueSecondary: '#2d42fc',
      purpleSecondary: '#9747FF',
      grayTertiary: '#646C8180',
      grayQuaternary: '#666',
      blueGradient: 'linear-gradient(89.29deg, #101c88 -48.14%, #2d42fc 127.87%);',
      greenGradient: 'linear-gradient(89.29deg, #34739C -48.14%, #3CD68D 127.87%);',
      redGradient: 'linear-gradient(89.29deg, #34739C -48.14%, #3CD68D 127.87%);',
      opaqueBlack: 'rgba(0, 0, 0, 0.8)',
      opaqueWhite: 'rgba(255, 255, 255, 0.95)',
      lightBtnHover: '#39A595',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      laptop: '1140px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
    }),
    presetTypography(),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: [
          {
            name: 'DM Sans',
            weights: ['400', '500', '700'],
          },
        ],
        serif: 'DM Serif Display',
        mono: 'DM Mono',
        manrope: [
          {
            name: 'Manrope',
            weights: ['400', '500', '600', '700'],
          },
        ],
      },
    }),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  safelist: 'prose prose-sm m-auto text-left'.split(' '),
});
