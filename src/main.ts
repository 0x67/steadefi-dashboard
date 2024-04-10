import { ViteSSG } from 'vite-ssg';
import { setupLayouts } from 'virtual:generated-layouts';
import App from './App.vue';
import type { UserModule } from './types';
import generatedRoutes from '~pages';

import '@unocss/reset/tailwind.css';
import 'uno.css';
import './styles/main.css';
import { Buffer } from 'buffer';
import '@vuepic/vue-datepicker/dist/main.css'
window.Buffer = Buffer;

const routes = setupLayouts(generatedRoutes);

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL }, (ctx) => {
  // install all modules under `modules/`
  Object.values(
    import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }),
  ).forEach((i) => i.install?.(ctx));

  ctx.router.afterEach((to, from) => {
    if (to.path !== from.path && to.params?.id) {
      window.scrollTo(0, 0);
    }
  });
});
