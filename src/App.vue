<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from 'stores/app';
import { useApiStore } from 'stores/api';
import { useItemsStore } from 'stores/items';
import { useTauri } from 'src/composables/tauri';

const { setTheme, setLocale } = useAppStore();
const { testConnection, testServerPluginSegmentsApi } = useApiStore();
const { getCollectionss } = useItemsStore();
const { hide_splashscreen } = useTauri();


// apply theme
setTheme();

// apply locale
setLocale();

// close splash after load
hide_splashscreen()

// Test connection async
console.log('Testing connection state')
testConnection().then((state) => { if (state) { getCollectionss() } });

console.log('Testing plugin state')
testServerPluginSegmentsApi()
</script>
