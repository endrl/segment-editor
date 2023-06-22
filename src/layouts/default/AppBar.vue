<template>
  <v-app-bar :elevation="2">
    <v-app-bar-title>
      Jellyfin Segment Editor
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn @click.prevent="toggleOpenOptions"><i-mdi-cog></i-mdi-cog></v-btn>
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useSessionStore } from '@/store/session';

const sesssionStore = useSessionStore();

const toggleOpenOptions = () => sesssionStore.openOptions = !sesssionStore.openOptions;
</script>
