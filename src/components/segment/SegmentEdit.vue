<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', false)">
    <q-card style="width:300px">
      <q-card-section>
        <div class="row">
          <div class="text-h6 col-10 text-ellipsis">
            {{ $t('segment.edit') }}

          </div>
          <div class="col-shrink col-2">
            <q-btn flat @click="$emit('update:modelValue', false)"><q-icon><i-mdi-close /></q-icon></q-btn>
          </div>
          <div class="text-subtitle2 col-12">
            <div class="wrap">{{ item.Name }}: {{ localSegment.Type }}{{ localSegment.TypeIndex > 0 ?
              `(${localSegment.TypeIndex + 1})`
              :
              ''
            }}
            </div>
            <div>
              {{ $t('segment.start') }}: {{ getReadableTimeFromSeconds(Math.round(localSegment.Start)) }}
            </div>
            <div>
              {{ $t('segment.end') }}: {{ getReadableTimeFromSeconds(Math.round(localSegment.End))
              }}
            </div>
            <div>
              {{ $t('segment.duration') }}: {{ getReadableTimeFromSeconds(Math.round(localSegment.End -
                localSegment.Start))
              }}
            </div>
            <br />
            <div>{{ $t('editor.lastEditor') }}:</div>
            <div>{{ getNameForCreatorId(localSegment.CreatorId) }}</div>
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <q-input v-model.number="localSegment.Start" :label="$t('segment.start')" :rules="[rule]" reactive-rules
          suffix="s" type="number">
          <template #prepend>
            <i-mdi-ray-start-arrow />
          </template>
        </q-input>
        <q-input v-model.number="localSegment.End" :label="$t('segment.end')" :rules="[rule]" reactive-rules suffix="s"
          type="number">
          <template #prepend>
            <i-mdi-ray-end-arrow />
          </template>
        </q-input>
        <q-select v-model="localSegment.Action" :options="Object.values(MediaSegmentAction)"
          :label="$t('segment.recaction')">
          <template #prepend>
            <i-mdi-play-pause />
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn @click.prevent="saveSegment">{{ $t('editor.saveSegment') }}</q-btn>
        <q-btn @click.prevent="openConfirmDialog"><i-mdi-delete /></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ItemDto, MediaSegment, MediaSegmentAction } from 'src/interfaces';
import { reactive, watch } from 'vue';
import { CREATOR_UUID, getNameForCreatorId } from 'src/composables/constants'
import { useI18n } from 'vue-i18n';
import { useDialog } from 'src/composables/dialog';
import { useUtils } from 'src/composables/utils'
import { useQuasar } from 'quasar'


const { getReadableTimeFromSeconds } = useUtils()
const { t } = useI18n()
const $q = useQuasar()

interface Props {
  modelValue: boolean,
  segment: MediaSegment,
  item: ItemDto,
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'saveSegment', 'deleteSegment'])

let localSegment = reactive(props.segment)

// whenever we push a new prop we want a copy from it for editing
watch(() => props.segment, (newValue: Props['segment']) => {
  localSegment = reactive(JSON.parse(JSON.stringify(newValue)));
});

const saveSegment = () => {
  if (rule() !== true) return
  // inject our creatorId, we take over ownership of the segment
  localSegment.CreatorId = CREATOR_UUID;
  emit('saveSegment', JSON.parse(JSON.stringify(localSegment)));
}
const deleteSegment = () => {
  emit('deleteSegment', JSON.parse(JSON.stringify(localSegment)));
}

const rule = () => localSegment.Start >= localSegment.End ? t('validation.StartEnd') : true;

const openConfirmDialog = () => {
  $q.dialog({
    title: t('editor.deleteSureTitle'),
    message: t('editor.deleteSure', { Type: localSegment.Type }),
    cancel: true,
    persistent: true
  }).onOk(() => {
    deleteSegment()
  })
}
</script>
