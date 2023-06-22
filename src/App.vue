<template>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script lang="ts" setup>
import { useAppStore } from './store/app';
import { useApiStore } from './store/api';
import { useItemsStore } from './store/items';
import { useTauri } from './composables/tauri';

const { setTheme, setLocale } = useAppStore();
const { testConnection } = useApiStore();
const { getCollectionss } = useItemsStore();
const { hide_splashscreen } = useTauri();


// apply theme
setTheme();

// apply locale
setLocale();

// close splash after load
hide_splashscreen()

// Test connection async
testConnection().then((state) => { if (state) getCollectionss() });
</script>
