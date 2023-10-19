<template>
  <Suspense>
    <q-layout view="lhh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-toolbar-title>
            Jellyfin Segment Editor
          </q-toolbar-title>

          <q-btn flat dense round aria-label="Settings" @click="toggleSettingsDialog">
            <i-mdi-cog />
          </q-btn>

        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view />
        <SettingsDialog />
      </q-page-container>
    </q-layout>
  </Suspense>
</template>

<script setup lang="ts">
import { useSessionStore } from 'stores/session';

const sesssionStore = useSessionStore();

const toggleSettingsDialog = () => sesssionStore.openOptions = !sesssionStore.openOptions;
</script>
