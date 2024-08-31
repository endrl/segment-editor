<template>
  <div class="q-mb-md">
    <div class="row">
      <div>
        <q-chip clickable @click="$router.push(`/player/${item.Id}`)" class="q-mb-sm q-mr-sm" outline>
          <q-icon>
            <i-mdi-filmstrip />
          </q-icon>
        </q-chip>

        <q-chip clickable @click="showDialogWith(segment)" class="q-mb-sm q-mr-sm" :color="getColorByType(segment.Type)"
          v-for="segment in getCurrentSegments" :key="segment.Id + '_chip'">
          {{ segment.Type }}: {{ getReadableTimeFromSeconds(Math.round(segment.EndTicks - segment.StartTicks)) }}
        </q-chip>

        <SegmentAdd :itemId="item.Id" @saveSegment="saveNewSegment" />
        <SegmentEdit :item="item" v-model="dialog" :segment="dialogSegment" @saveSegment="saveUpdatedSegmentLocal"
          @deleteSegment="deleteSegmentLocal" />
      </div>
      <div class="q-ml-auto">
        <q-chip v-if="pluginStore.showEdlBtn()" clickable outline @click="writeEdl">
          edl
        </q-chip>
        <q-chip clickable outline @click="copyFromSegmentClipboard">
          <q-icon>
            <i-mdi-content-paste />
          </q-icon>
        </q-chip>
        <q-chip clickable outline v-if="getCurrentSegments.length" @click="openConfirmDialog" color="negative">
          <q-icon>
            <i-mdi-trash-can />
          </q-icon>
        </q-chip>
      </div>
    </div>
    <div ref="bar" class="segment-bar full-width relative-position segment-bar-color">
      <SegmentVisual v-for="segment in getCurrentSegments" :key="segment.Id" :segment="segment"
        :duration="item.RunTimeTicks" :parentWidth="pwidth">
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
import { noop, useResizeObserver, useDebounceFn } from '@vueuse/core'
import { useUtils } from 'src/composables/utils';
import { useSegmentsStore } from 'stores/segments';
import { usePluginStore } from 'stores/plugin';
import { useSessionStore } from 'stores/session';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar'
import { usePluginEdlApi } from 'src/composables/pluginEdlApi';

const { getColorByType, getReadableTimeFromSeconds, sortSegmentsStart, generateUUID } = useUtils()
const { t } = useI18n()
const $q = useQuasar()
const { createEdlById } = usePluginEdlApi()

const pluginStore = usePluginStore()
const segmentsStore = useSegmentsStore()
const { getFromSegmentClipboard } = useSessionStore()
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

const copyFromSegmentClipboard = () => {
  let seg = getFromSegmentClipboard()
  if (seg) {
    // update itemID and id
    seg.Id = generateUUID()
    seg.ItemId = props.item.Id
    saveNewSegment(seg)
  } else {
    $q.notify({ message: t('editor.noSegmentInClipboard'), type: 'negative' })
  }
}

const writeEdl = () => {
  createEdlById([props.item.Id])
  $q.notify({ message: t('plugin.edl.created') })
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
