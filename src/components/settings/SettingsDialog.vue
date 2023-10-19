<template>
  <q-dialog v-model="showDialog" :persistent="!apiStore.validConnection && !apiStore.validAuth">
    <q-card style="width: 280px;">
      <q-card-section>
        <div class="text-h6">Server</div>
        <AuthSettings />
      </q-card-section>
      <q-card-section>
        <div class="text-h6">App</div>
        <AppSettings />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


<script lang="ts" setup>
import { useApiStore } from 'stores/api';
import { useSessionStore } from 'stores/session';
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
