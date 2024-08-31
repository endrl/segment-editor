<template>
  <router-view />
</template>

<script lang="ts" setup>
import { useAppStore } from 'stores/app';
import { useApiStore } from 'stores/api';
import { usePluginStore } from 'stores/plugin';

import { useTauri } from 'src/composables/tauri';

const { setTheme, setLocale } = useAppStore();
const { testConnection } = useApiStore();
const { testServerPlugins } = usePluginStore();
const { hide_splashscreen } = useTauri();


// apply theme
setTheme();

// apply locale
setLocale();

// close splash after load
hide_splashscreen()

// Test connection async
console.log('Testing connection state')
testConnection()

console.log('Testing plugin state')
testServerPlugins()
</script>
