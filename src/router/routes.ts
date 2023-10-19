import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'player/:itemId', component: () => import('pages/PlayerPage.vue') },
      { path: 'series/:itemId', component: () => import('pages/SeriesPage.vue') },
      { path: 'artist/:itemId', component: () => import('pages/ArtistPage.vue') },
      { path: 'album/:itemId', component: () => import('pages/AlbumPage.vue') }


    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
