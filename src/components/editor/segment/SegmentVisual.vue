<template>
  <div class="position-absolute" :style="getStyle"></div>
</template>

<script setup lang="ts">
import { ItemDto, MediaSegment } from '@/interfaces';
import { computed } from 'vue';
import { useUtils } from '@/composables/utils';

const { getColorByType, ticksToMs } = useUtils()

interface Props {
  parentWidth: number,
  segment: MediaSegment,
  duration: ItemDto["RunTimeTicks"],
}
const props = defineProps<Props>()
const durationSecs = ticksToMs(props.duration) / 1000;

const getStyle = computed(() => {
  return {
    left: Math.round(props.parentWidth / durationSecs * props.segment.Start) + 'px',
    width: Math.max(8, Math.round(props.parentWidth / durationSecs * (props.segment.End - props.segment.Start))) + 'px',
    'background-color': getColorByType(props.segment.Type),
    height: '100%'
  }
});

</script>

<style>
.position-absolute {
  position: absolute;
}
</style>
