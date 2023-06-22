<template>
  <div class="d-flex flex-nowrap">
    <div class="mr-2 my-2 movie-poster">
      <ItemImage :width="46" :height="70" :item="item"></ItemImage>
    </div>
    <div class="flex-grow-1">
      <div class="d-flex align-center">
        <p class="text-medium-emphasis text-subtitle-1">{{ item.Name }}</p>
      </div>
      <EditorBar :item="item"></EditorBar>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ItemDto } from '@/interfaces';

interface Props {
  item: ItemDto
}

defineProps<Props>()
</script>

<style>
.movie-poster {
  width: 46px;
  height: 70px
}
</style>
