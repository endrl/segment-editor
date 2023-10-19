<template>
  <div class="q-mb-md">
    <div class="row">
      <q-chip clickable @click="$router.push(`/player/${item.Id}`)" class="q-mb-sm q-mr-sm" outline>
        <q-icon>
          <i-mdi-filmstrip />
        </q-icon>
      </q-chip>

      <q-chip clickable @click="showDialogWith(segment)" class="q-mb-sm q-mr-sm" :color="getColorByType(segment.Type)"
        v-for="segment in getCurrentSegments" :key="segment.Type + segment.TypeIndex + segment.ItemId + '_chip'">
        {{ segment.Type }}: {{ getReadableTimeFromSeconds(Math.round(segment.End - segment.Start)) }}
      </q-chip>

      <SegmentAdd :itemId="item.Id" @saveSegment="saveNewSegment" />
      <SegmentEdit :item="item" v-model="dialog" :segment="dialogSegment" @saveSegment="saveUpdatedSegmentLocal"
        @deleteSegment="deleteSegmentLocal" />

      <q-chip clickable outline v-if="getCurrentSegments.length" @click="openConfirmDialog" color="negative"
        class="q-ml-auto">
        <q-icon>
          <i-mdi-trash-can />
        </q-icon>
      </q-chip>
    </div>
    <div ref="bar" class="segment-bar full-width relative-position segment-bar-color">
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
import { ItemDto, MediaSegment } from 'src/interfaces';
import { computed, ref } from 'vue';
import { noop, useResizeObserver } from '@vueuse/core'
import { useDebounceFn } from '@vueuse/core'
import { useUtils } from 'src/composables/utils';
import { useSegmentsStore } from 'stores/segments';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar'

const { getColorByType, getReadableTimeFromSeconds, sortSegmentsStart } = useUtils()
const { t } = useI18n()
const $q = useQuasar()


const segmentsStore = useSegmentsStore()
const { saveUpdatedSegment, saveNewSegment, deleteSegment, deleteSegments } = segmentsStore
const { localSegments } = storeToRefs(segmentsStore)

const props = defineProps<Props>()
const bar = ref<HTMLBodyElement | undefined>(undefined);

const pwidth = ref(250);
const dialogSegment = ref<MediaSegment>(new MediaSegment())
const dialog = ref(false);

// get segments for this id
segmentsStore.getNewSegmentsById(props.item.Id)

const debouncedRequest = useDebounceFn(noop, 500, { maxWait: 1500 })

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

const openConfirmDialog = () => {
  $q.dialog({
    title: t('editor.deleteSureTitle', { count: getCurrentSegments.value.length }),
    message: t('editor.deleteSegments', { item: props.item.Name }),
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteSegments(props.item.Id)
  })
}
</script>

<style>
.segment-bar {
  height: 10px;
}

.body--light .segment-bar-color {
  background-color: #e2e2e2;
}

.body--dark .segment-bar-color {
  background-color: #555555;
}
</style>
