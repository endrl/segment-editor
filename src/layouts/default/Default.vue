<template>
  <v-app>
    <default-bar />
    <default-view />

    <OptionsDialog />
    <ReusableModal />
  </v-app>
</template>

<script lang="ts" setup>
import DefaultBar from './AppBar.vue'
import DefaultView from './View.vue'
</script>
