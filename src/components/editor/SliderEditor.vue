<template>
  <v-dialog fullscreen persistent :model-value="modelValue" @update:model-value="$emit('update:modelValue')">
    <v-card v-if="modelValue">
      <v-card-title>
        {{ item.SeriesName ? `${item.SeriesName} S${item.ParentIndexNumber}E${item.IndexNumber}: ${item.Name}` : item.Name
        }}
        <v-btn flat style="float:right"
          @click="$emit('update:modelValue', false)"><v-icon><i-mdi-close /></v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <player @create-segment="createSegmentFromPlayer" :timestamp="playerTimestamp" :item="item"
          @update-segment-timestamp="newSegmentTimestamp = $event"></player>
        <div class="mt-6">
          <SegmentSlider @player-timestamp="updatePlayerTimestamp" @update:model-value="updateItem"
            @delete-segment="deleteLocalSegment" @update-active-index="activeIdx = $event" :idx="idx"
            :activeIdx="activeIdx" :newTimestamp="newSegmentTimestamp" v-for="(segment, idx) in editingSegments"
            :segment="segment" :segments="editingSegments" :item="item"
            :key="segment.ItemId + segment.Type + segment.TypeIndex" min="0" :max="runtimeSeconds" thumb-label="always"
            class="full-width"></SegmentSlider>
        </div>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn color="surface-variant" @click="saveAllSegments"> {{ $t('editor.saveSegment') }}</v-btn>
        <v-btn color="surface-variant" @click="$emit('update:modelValue', false)"> {{ $t('close') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { CREATOR_UUID } from '@/composables/constants';
import { useUtils } from '@/composables/utils';
import { ItemDto, MediaSegment, MediaSegmentAction, MediaSegmentType } from '@/interfaces';
import { useSegmentsStore } from '@/store/segments';
import { storeToRefs } from 'pinia';
import { reactive, ref, watch } from 'vue';

const { sortSegmentsStart, ticksToMs } = useUtils()

const segmentsStore = useSegmentsStore()
const { saveNewSegments, deleteSegments } = segmentsStore
const { localSegments } = storeToRefs(segmentsStore)
const playerTimestamp = ref<number | undefined>(undefined);
// the current active segmentslider which reacts to player start/end time pushes
const activeIdx = ref(0)
const newSegmentTimestamp = ref<object | undefined>({})

interface Props {
  modelValue: boolean,
  item: ItemDto,
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

let editingSegments: MediaSegment[] = reactive(new Array<MediaSegment>())

// whenever we show the dialog we want a copy from segments for editing
watch(() => props.modelValue, (newValue: boolean) => {
  if (newValue) {
    const segs = localSegments.value.filter((seg: MediaSegment) => seg.ItemId == props.item.Id).sort(sortSegmentsStart)
    editingSegments = reactive(JSON.parse(JSON.stringify(segs)));
  }
});

const runtimeSeconds = ticksToMs(props.item.RunTimeTicks) / 1000;

const updateItem = (obj: any) => {
  const found = editingSegments.find((seg: MediaSegment) => seg.ItemId == obj.itemId && seg.Type == obj.type && seg.TypeIndex == obj.typeIndex)
  if (found) {
    found.Start = obj.start
    found.End = obj.end
    found.Action = obj.action
  }
}

const updatePlayerTimestamp = (newtimestamp: number) => {
  // reset prop
  setTimeout(() => playerTimestamp.value = undefined, 500)
  playerTimestamp.value = newtimestamp
}

const createSegmentFromPlayer = (obj: { type: MediaSegmentType; start: number; }) => {
  const seg: MediaSegment = {
    Type: obj.type, TypeIndex: 0, Start: obj.start, End: obj.start, ItemId: props.item.Id, CreatorId: CREATOR_UUID, Action: MediaSegmentAction.AUTO
  }

  const found = editingSegments.find((seg: MediaSegment) => seg.ItemId == props.item.Id && seg.Type == obj.type && seg.TypeIndex == 0)
  if (found) {
    seg.TypeIndex += 1
  }
  editingSegments.push(seg)
  activeIdx.value = editingSegments.length - 1
}

const deleteLocalSegment = (idx: number) => {
  editingSegments.splice(idx, 1)
}

const saveAllSegments = () => {
  // delete all current segments
  deleteSegments(props.item.Id)
  // save all
  saveNewSegments(editingSegments)
  // close dialog
  emit('update:modelValue', false)
}
</script>
