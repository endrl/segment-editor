<template>
  <div class="d-flex flex-column">
    <div class="d-flex flex-wrap justify-start align-center">
      <div class="mr-1" style="width:3px; height:40px">
        <div v-if="idx == activeIdx && showVideoPlayer" class="bg-deep-purple-lighten-3 h-100 w-100"></div>
      </div>
      <v-btn @click="$emit('updateActiveIndex', props.idx)" :color="getColorByType(segment.Type)">{{ segment.Type }}{{
        segment.TypeIndex ? ` ${segment.TypeIndex + 1}` :
        '' }}</v-btn>
      <div class="d-flex align-center">
        <v-btn class="ml-1" @click="focusSlider(true)">
          <div class="d-flex flex-column">
            <div>{{ $t('segment.start') }}</div>
            <div style="font-size: 80%;">{{ getTimefromSeconds(range[0]) }}</div>
          </div>
        </v-btn>
        <v-text-field :model-value="range[0]" hide-details single-line type="number" min="0" variant="outlined"
          class="ml-1" density="compact" style="width: 120px" step="0.1"
          @change="update(range, 0, $event)"></v-text-field>
        <v-btn v-if="showVideoPlayer" class="ml-2" variant="tonal" @click="$emit('playerTimestamp', range[0])">
          <v-icon><i-mdi-skip-forward /></v-icon>
        </v-btn>
      </div>
      <div class="d-flex align-center">
        <v-btn class="ml-1" @click="focusSlider(false)">
          <div class="d-flex flex-column">
            <div>{{ $t('segment.end') }}</div>
            <div style="font-size: 80%;">{{ getTimefromSeconds(range[1]) }}</div>
          </div>
        </v-btn>
        <v-text-field :model-value="range[1]" hide-details single-line type="number" min="0" variant="outlined"
          style="width: 120px" class="ml-1" density="compact" step="0.1"
          @change="update(range, 1, $event)"></v-text-field>
        <v-btn v-if="showVideoPlayer" class="ml-2" variant="tonal" @click="$emit('playerTimestamp', range[1])">
          <v-icon><i-mdi-skip-forward /></v-icon>
        </v-btn>
      </div>
      <v-btn @click="$emit('deleteSegment', idx)" color="error" class="ml-auto">
        <v-icon>
          <i-mdi-trash-can />
        </v-icon>
      </v-btn>
    </div>

    <v-range-slider ref="sliderRef" min="0" step="0.1" :max="runtimeSeconds" v-model="range" class="full-width mt-2">
    </v-range-slider>
  </div>
</template>

<script setup lang="ts">
import { useUtils } from '@/composables/utils';
import { ItemDto, MediaSegment } from '@/interfaces';
import { useAppStore } from '@/store/app';
import { computed, shallowRef } from 'vue';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';

const { getColorByType, getTimefromSeconds, ticksToMs, stringToNumber, numberToNumber } = useUtils()

const appStore = useAppStore()
const { showVideoPlayer } = storeToRefs(appStore)

interface Props {
  idx: number,
  item: ItemDto,
  segment: MediaSegment,
  segments: MediaSegment[],
  activeIdx: number,
  newTimestamp?: object,
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'playerTimestamp', 'updateActiveIndex', 'deleteSegment'])
const sliderRef = shallowRef<HTMLElement>();

const runtimeSeconds = ticksToMs(props.item.RunTimeTicks) / 1000;
const range = computed({
  get() {
    return [props.segment.Start, props.segment.End]
  },
  set(newValue: Array<number>) {
    const start = numberToNumber(newValue[0])
    const end = numberToNumber(newValue[1])
    emit('update:modelValue', { itemId: props.item.Id, start, end, type: props.segment.Type, typeIndex: props.segment.TypeIndex, action: props.segment.Action })
  }
})

watch(() => props.newTimestamp, (val) => {
  if (props.activeIdx == props.idx && val) {
    let start = numberToNumber(range.value[0])
    let end = numberToNumber(range.value[1])
    if (val.start) {
      start = numberToNumber(val.currentTime)
    } else {
      end = numberToNumber(val.currentTime)
    }

    emit('update:modelValue', { itemId: props.item.Id, start, end, type: props.segment.Type, typeIndex: props.segment.TypeIndex, action: props.segment.Action })
  }
})

const focusSlider = (start: boolean) => {
  const refs = sliderRef?.value?.$el?.firstElementChild.childNodes[1].childNodes
  if (!refs) {
    console.error("Failed to focus slider!")
    return
  }
  if (start) {
    refs[3].focus()
  } else {
    refs[4].focus()
  }
}

const update = (range: any, ind: any, event: any) => {
  let start = stringToNumber(range[0])
  let end = stringToNumber(range[1])

  if (ind) {
    end = stringToNumber(event.srcElement._value)
  } else {
    start = stringToNumber(event.srcElement._value)
  }

  emit('update:modelValue', { itemId: props.item.Id, start, end, type: props.segment.Type, typeIndex: props.segment.TypeIndex, action: props.segment.Action })
}

</script>
