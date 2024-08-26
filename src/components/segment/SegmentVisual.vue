<template>
  <div :class="'absolute full-height bg-' + getColorByType(props.segment.Type)" :style="getStyle"></div>
</template>

<script setup lang="ts">
import { ItemDto, MediaSegment } from 'src/interfaces';
import { computed } from 'vue';
import { useUtils } from 'src/composables/utils';

const { getColorByType, ticksToMs } = useUtils()

interface Props {
  parentWidth: number,
  segment: MediaSegment,
  duration: ItemDto['RunTimeTicks'],
}
const props = defineProps<Props>()
const durationSecs = ticksToMs(props.duration) / 1000;

const getStyle = computed(() => {
  return {
    left: Math.round(props.parentWidth / durationSecs * props.segment.StartTicks) + 'px',
    width: Math.max(8, Math.round(props.parentWidth / durationSecs * (props.segment.EndTicks - props.segment.StartTicks))) + 'px',
  }
});

</script>
