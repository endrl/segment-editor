<template>
  <div class="column">
    <div class="row justify-start items-center">
      <div class="q-mr-xs" style="width:3px; height:40px">
        <div v-if="idx == activeIdx && showVideoPlayer" class="bg-blue fit"></div>
      </div>
      <q-btn @click="$emit('updateActiveIndex', props.idx)" :color="getColorByType(segment.Type)">{{ segment.Type }}{{
        segment.TypeIndex ? ` ${segment.TypeIndex + 1}` :
        '' }}</q-btn>
      <div class="row items-center">
        <div class="q-ml-md column">
          <div>{{ $t('segment.start') }}</div>
          <div style="font-size: 80%;">{{ getTimefromSeconds(range.min) }}</div>
        </div>
        <q-input :model-value="range.min" type="number" min="0" outline class="q-ml-sm" dense style="width: 90px"
          step="0.1" @change="update(0, $event)"></q-input>
        <q-btn v-if="showVideoPlayer" class="q-ml-sm" round outline dense @click="$emit('playerTimestamp', range.min)">
          <q-icon><i-mdi-skip-forward /></q-icon>
        </q-btn>
      </div>
      <div class="row items-center">
        <div class="q-ml-md column">
          <div>{{ $t('segment.end') }}</div>
          <div style="font-size: 80%;">{{ getTimefromSeconds(range.max) }}</div>
        </div>
        <q-input :model-value="range.max" type="number" min="0" outline style="width: 90px" class="q-ml-sm" dense
          step="0.1" @change="update(1, $event)"></q-input>
        <q-btn v-if="showVideoPlayer" class="q-ml-sm" round outline dense @click="$emit('playerTimestamp', range.max)">
          <q-icon><i-mdi-skip-forward /></q-icon>
        </q-btn>
      </div>
      <q-btn class="q-ml-auto" @click="$emit('deleteSegment', idx)" color="negative" round outline dense>
        <q-icon>
          <i-mdi-trash-can />
        </q-icon>
      </q-btn>
    </div>

    <q-range ref="sliderRef" :min="0" :step="0.1" :max="runtimeSeconds" v-model="range" class="full-width q-mt-sm q-px-sm"
      :color="getColorByType(segment.Type)">
    </q-range>
  </div>
</template>

<script setup lang="ts">
import { useUtils } from 'src/composables/utils';
import { ItemDto, MediaSegment } from 'src/interfaces';
import { useAppStore } from 'stores/app';
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
    return { min: props.segment.Start, max: props.segment.End }
  },
  set(newValue: object) {
    const start = numberToNumber(newValue.min)
    const end = numberToNumber(newValue.max)
    emit('update:modelValue', { itemId: props.item.Id, start, end, type: props.segment.Type, typeIndex: props.segment.TypeIndex, action: props.segment.Action })
  }
})

watch(() => props.newTimestamp, (val) => {
  if (props.activeIdx == props.idx && val) {
    let start = numberToNumber(range.value.min)
    let end = numberToNumber(range.value.max)
    if (val.start) {
      start = numberToNumber(val.currentTime)
    } else {
      end = numberToNumber(val.currentTime)
    }

    emit('update:modelValue', { itemId: props.item.Id, start, end, type: props.segment.Type, typeIndex: props.segment.TypeIndex, action: props.segment.Action })
  }
})

const update = (ind: any, event: any) => {
  let start = stringToNumber(range.value.min)
  let end = stringToNumber(range.value.max)

  if (ind) {
    end = stringToNumber(event)
  } else {
    start = stringToNumber(event)
  }

  emit('update:modelValue', { itemId: props.item.Id, start, end, type: props.segment.Type, typeIndex: props.segment.TypeIndex, action: props.segment.Action })
}

</script>
