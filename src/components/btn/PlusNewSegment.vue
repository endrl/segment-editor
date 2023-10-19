<template>
  <q-btn class="q-ml-md" outline round dense>
    <q-icon><i-mdi-plus /></q-icon>
    <q-menu auto-close anchor="top left" self="bottom left">
      <q-list>
        <q-item clickable @click="$emit('createSegment', { start: 0, type: item })"
          v-for="(item, index) in Object.values(MediaSegmentType)" :key="index" :value="index">
          <q-item-section>{{ item }}</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { MediaSegmentType } from 'src/interfaces';


defineEmits(['createSegment'])
</script>
