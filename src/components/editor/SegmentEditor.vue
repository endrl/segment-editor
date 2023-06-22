<template>
  <SegmentEditorSeries v-if="isSeries(item)" :item=item></SegmentEditorSeries>
  <SegmentEditorMovie v-else-if="isMovie(item)" :item=item></SegmentEditorMovie>
  <div v-else>Collection of type '{{ item.Type }}' is not implemented. If you see a use case for it please open an issue
  </div>
</template>

<script lang="ts" setup>
import { ItemDto } from '@/interfaces';

interface Props {
  item: ItemDto
}

defineProps<Props>()

const isSeries = (item: ItemDto) => item.Type === 'Series';
const isMovie = (item: ItemDto) => item.Type === 'Movie';

</script>

<style></style>
