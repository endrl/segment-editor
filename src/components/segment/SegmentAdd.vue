<template>
  <q-chip clickable outline class="q-mb-sm q-mr-sm " @click="showDialog = true">
    <q-icon>
      <i-mdi-plus></i-mdi-plus>
    </q-icon>
  </q-chip>
  <q-dialog v-model="showDialog">
    <q-card style="width:300px">
      <q-card-section>
        <div class="row">
          <div class="text-h6 col-10 text-ellipsis">
            {{ $t('editor.newSegment') }}
          </div>
          <div class="col-shrink col-2">
            <q-btn flat @click="showDialog = false"><q-icon><i-mdi-close /></q-icon></q-btn>

          </div>
          <div class="text-subtitle2 col-12">
            <div>
              {{ $t('segment.start') }}: {{ getReadableTimeFromSeconds(Math.round(localSegment.StartTicks)) }}
            </div>
            <div>
              {{ $t('segment.end') }}: {{ getReadableTimeFromSeconds(Math.round(localSegment.EndTicks))
              }}
            </div>
            <div>
              {{ $t('segment.duration') }}: {{ getReadableTimeFromSeconds(Math.round(localSegment.EndTicks -
    localSegment.StartTicks))
              }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-input v-model.number="localSegment.StartTicks" :label="$t('segment.start')" :rules="[rule]" reactive-rules
          suffix="s" min="0" type="number">
          <template #prepend>
            <i-mdi-ray-start-arrow />
          </template>
        </q-input>
        <q-input v-model.number="localSegment.EndTicks" :label="$t('segment.end')" :rules="[rule]" reactive-rules
          suffix="s" min="0" type="number">
          <template #prepend>
            <i-mdi-ray-end-arrow />
          </template>
        </q-input>
        <q-select v-model="localSegment.Type" :options="Object.values(MediaSegmentType)" :label="$t('segment.type')">
          <template #prepend>
            <i-mdi-movie />
          </template>
        </q-select>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn @click="saveSegment">{{ $t('editor.saveSegment') }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ItemDto, MediaSegment, MediaSegmentType } from 'src/interfaces';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUtils } from 'src/composables/utils'

const { getReadableTimeFromSeconds, generateUUID } = useUtils()
const { t } = useI18n()

interface Props {
  itemId: ItemDto['Id'],
}

const props = defineProps<Props>()
const emit = defineEmits(['saveSegment'])

const showDialog = ref(false)
let localSegment = reactive(new MediaSegment())

localSegment.Id = generateUUID()

const rule = () => (localSegment.StartTicks >= localSegment.EndTicks) ? t('validation.StartEnd') : true;

const saveSegment = async () => {
  if (rule() !== true) return

  showDialog.value = false
  // inject itemId
  localSegment.ItemId = props.itemId
  emit('saveSegment', JSON.parse(JSON.stringify(localSegment)));
}
</script>
