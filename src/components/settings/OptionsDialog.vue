<template>
  <v-dialog v-model="showDialog" :persistent="!apiStore.validConnection" width="400">
    <v-card>
      <v-card-text>
        <div class="text-h6 my-3">Server</div>
        <Auth />
      </v-card-text>
      <v-card-text>
        <div class="text-h6 my-3">App</div>
        <AppOptions></AppOptions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>


<script lang="ts" setup>
import { useApiStore } from '@/store/api';
import { useSessionStore } from '@/store/session';
import { computed } from 'vue'

const apiStore = useApiStore();
const sessionStore = useSessionStore();

const showDialog = computed({
  get() {
    return !apiStore.validConnection || !apiStore.validAuth || sessionStore.openOptions
  },
  set(newValue) {
    sessionStore.openOptions = newValue
  }
})
</script>
