<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,

import { NMessageProvider } from 'naive-ui'
// they will be rendered correctly in the html results with vite-ssg
useHead({
  title: 'Steadefi | Leverage yield strategy vaults with automated rebalancing and risk management',
  meta: [
    {
      name: 'description',
      content:
        'Steadefi is an advanced leveraged yield aggregator that focuses on maximizing yields from a variety of sources while managing market risks automatically.',
    },
    {
      name: 'theme-color',
      content: computed(() => (isDark.value ? '#00aba9' : '#ffffff')),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicons/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicons/favicon-16x16.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '192x192',
      href: '/favicons/android-chrome-192x192.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '512x512',
      href: '/favicons/android-chrome-512x512.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/favicons/apple-touch-icon.png',
    },

    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
  ],
});
</script>

<template>
  <n-message-provider>
    <RouterView />
  </n-message-provider>
</template>
