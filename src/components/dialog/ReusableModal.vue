<template>
  <v-dialog persistent v-model="isOpen" width="300px">
    <v-card>
      <component :is="view" :viewProps="viewProps" v-model="model"></component>
      <v-card-actions class="justify-center">
        <v-btn v-for="action in actions" color="surface-variant" :key="action.label" @click="action.callback(model)">
          {{ action.label }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { storeToRefs } from "pinia";
import { useModalStore } from '@/store/modal';

const modal = useModalStore();

// reactive container to save the payload returned by the mounted view
const model = reactive({});

const { isOpen, view, actions, viewProps } = storeToRefs(modal);
</script>
