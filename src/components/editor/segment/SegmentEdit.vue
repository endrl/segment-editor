<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', false)" width="350px">
    <v-card>
      <v-card-title>
        {{ $t('segment.edit') }}
        <v-btn flat style="float:right"
          @click="$emit('update:modelValue', false)"><v-icon><i-mdi-close /></v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        <p>{{ item.Name }}: {{ localSegment.Type }}{{ localSegment.TypeIndex > 0 ? `(${localSegment.TypeIndex + 1})` : ''
        }}
        </p>
        <p>
          {{$t('segment.start')}}: {{ getReadableTimeFromSeconds(Math.round(localSegment.Start)) }}
        </p>
        <p>
          {{$t('segment.duration')}}: {{ getReadableTimeFromSeconds(Math.round(localSegment.End - localSegment.Start)) }}
        </p>
        <br />
        <p>{{ $t('editor.lastEditor') }}:</p>
        <p>{{ getNameForCreatorId(localSegment.CreatorId) }}</p>
      </v-card-subtitle>
      <v-card-text>
        <v-text-field v-model.number="localSegment.Start" :label="$t('segment.start')" @input="validate"
          :error-messages="validationError" suffix="s" type="number">
          <template #prepend>
            <i-mdi-ray-start-arrow />
          </template>
        </v-text-field>
        <v-text-field v-model.number="localSegment.End" :label="$t('segment.end')" @input="validate"
          :error-messages="validationError" suffix="s" type="number">
          <template #prepend>
            <i-mdi-ray-end-arrow />
          </template>
        </v-text-field>
        <v-select v-model="localSegment.Action" :items="Object.values(MediaSegmentAction)"
          :label="$t('segment.recaction')">
          <template #prepend>
            <i-mdi-play-pause />
          </template>
        </v-select>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="surface-variant" @click.prevent="saveSegment">{{ $t('editor.saveSegment') }}</v-btn>
        <v-btn color="surface-variant" @click.prevent="openConfirmDialog"><i-mdi-delete /></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ItemDto, MediaSegment, MediaSegmentAction } from '@/interfaces';
import { reactive, ref, watch } from 'vue';
import { CREATOR_UUID, getNameForCreatorId } from '@/composables/constants'
import { useI18n } from 'vue-i18n';
import { useDialog } from '@/composables/dialog';
import { useUtils} from '@/composables/utils'

const { getReadableTimeFromSeconds } = useUtils()
const { t } = useI18n()
const { yesNoDialog } = useDialog()

interface Props {
  modelValue: boolean,
  segment: MediaSegment,
  item: ItemDto,
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'saveSegment', 'deleteSegment'])

let localSegment = reactive(props.segment)
const validationError = ref('')

// whenever we push a new prop we want a copy from it for editing
watch(() => props.segment, (newValue: Props['segment']) => {
  localSegment = reactive(JSON.parse(JSON.stringify(newValue)));
  validationError.value = ''
});

const saveSegment = () => {
  if (validationError.value != '') return
  // inject our creatorId, we take over ownership of the segment
  localSegment.CreatorId = CREATOR_UUID;
  emit('saveSegment', JSON.parse(JSON.stringify(localSegment)));
}
const deleteSegment = () => {
  emit('deleteSegment', JSON.parse(JSON.stringify(localSegment)));
}

const validate = () => {
  validationError.value = (localSegment.Start >= localSegment.End) ? t('validation.StartEnd') : '';
}

const openConfirmDialog = () => {
  const d = yesNoDialog(
    t('editor.deleteSureTitle'),
    t('editor.deleteSure', { Type: localSegment.Type }),
    (val) => {
      if (val)
        deleteSegment()
    })
  d.init()
  d.open()
}
</script>
