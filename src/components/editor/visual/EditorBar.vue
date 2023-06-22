<template>
  <div class="mb-3">
    <div class="d-flex flex-wrap">
      <SliderEditor :item="item" v-model="showSliderEditorDialog" />
      <v-chip @click="showSliderEditorDialog = true" class="mb-2 mr-2" variant="outlined">
        <v-icon>
          <i-mdi-filmstrip />
        </v-icon>
      </v-chip>
      <v-chip @click="showDialogWith(segment)" class="mb-2 mr-2" :color="getColorByType(segment.Type)" variant="outlined"
        v-for="segment in getCurrentSegments" :key="segment.Type + segment.TypeIndex + segment.ItemId + '_chip'">
        {{ segment.Type }}: {{ getReadableTimeFromSeconds(Math.round(segment.Start)) }}
      </v-chip>

      <SegmentAdd :itemId="item.Id" @saveSegment="saveNewSegment" />
      <SegmentEdit :item="item" v-model="dialog" :segment="dialogSegment" @saveSegment="saveUpdatedSegmentLocal"
        @deleteSegment="deleteSegmentLocal" />

      <v-chip v-if="getCurrentSegments.length" @click="openConfirmDialog" color="error" class="ml-auto">
        <v-icon>
          <i-mdi-trash-can />
        </v-icon>
      </v-chip>
    </div>
    <div ref="bar" :class="current.dark ? 'segment-bar segment-bar-color-dark' : 'segment-bar segment-bar-color-light'">
      <SegmentVisual v-for="segment in getCurrentSegments" :key="segment.Type + segment.TypeIndex + segment.ItemId"
        :segment="segment" :duration="item.RunTimeTicks" :parentWidth="pwidth">
      </SegmentVisual>
    </div>
  </div>
</template>

<script lang="ts">
interface Props {
  item: ItemDto
}
</script>

<script setup lang="ts">
import { ItemDto, MediaSegment } from '@/interfaces';
import { useTheme } from 'vuetify/lib/framework.mjs';
import { computed, ref } from 'vue';
import { useResizeObserver } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core'
import { useUtils } from '@/composables/utils';
import { useSegmentsStore } from '@/store/segments';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useDialog } from '@/composables/dialog';

const { getColorByType, getReadableTimeFromSeconds, sortSegmentsStart } = useUtils()
const { current } = useTheme()
const { t } = useI18n()

const segmentsStore = useSegmentsStore()
const { saveUpdatedSegment, saveNewSegment, deleteSegment, deleteSegments } = segmentsStore
const { localSegments } = storeToRefs(segmentsStore)

const props = defineProps<Props>()
const bar = ref<HTMLBodyElement | undefined>(undefined);

const pwidth = ref(250);
const dialogSegment = ref<MediaSegment>(new MediaSegment())
const dialog = ref(false);
const showSliderEditorDialog = ref(false)

// get segments for this id
segmentsStore.getNewSegmentsById(props.item.Id)

const debouncedRequest = useDebounceFn(() => { }, 500, { maxWait: 1500 })

useResizeObserver(bar, async (entries) => {
  await debouncedRequest()
  const entry = entries[0]
  const { width } = entry.contentRect
  pwidth.value = width;
})

const showDialogWith = (segment: MediaSegment) => {
  dialogSegment.value = segment;
  dialog.value = true;
}

const getCurrentSegments = computed(() => localSegments.value.filter((seg: MediaSegment) => seg.ItemId == props.item.Id).sort(sortSegmentsStart))

/**
 * Update segment
 * @param segment Modified segment
 */
const saveUpdatedSegmentLocal = (segment: MediaSegment) => {
  saveUpdatedSegment(segment)
  // hide dialog
  dialog.value = false
}

/**
 * Delete segment
 * @param segment segment to delete
 */
const deleteSegmentLocal = (segment: MediaSegment) => {
  deleteSegment(segment)
  // hide dialog
  dialog.value = false
}

const { yesNoDialog } = useDialog()

const openConfirmDialog = () => {
  const d = yesNoDialog(
    t('editor.deleteSureTitle', { count: getCurrentSegments.value.length }),
    t('editor.deleteSegments', { item: props.item.Name }),
    (val) => {
      if (val)
        deleteSegments(props.item.Id)
    })
  d.init()
  d.open()
}
</script>

<style>
.segment-bar {
  height: 10px;
  width: 100%;
  position: relative;
}

.segment-bar-color-light {
  background-color: #e2e2e2;
}

.segment-bar-color-dark {
  background-color: #555555;
}
</style>
