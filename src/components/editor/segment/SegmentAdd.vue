<template>
  <v-chip class="mb-2 mr-2 " @click="showDialog = true">
    <v-icon>
      <i-mdi-plus></i-mdi-plus>
    </v-icon>
  </v-chip>
  <v-dialog v-model="showDialog" width="350px">
    <v-card>
      <v-card-title>
        {{ $t('editor.newSegment') }}
        <v-btn flat style="float:right" @click="showDialog = false"><v-icon><i-mdi-close /></v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle>
        <p>
          {{$t('segment.start')}}: {{ getReadableTimeFromSeconds(Math.round(localSegment.Start)) }}
        </p>
        <p>
          {{$t('segment.duration')}}: {{ getReadableTimeFromSeconds(Math.round(localSegment.End - localSegment.Start)) }}
        </p>
      </v-card-subtitle>
      <v-card-text>
        <v-text-field v-model.number="localSegment.Start" :label="$t('segment.start')" :error-messages="validationError"
          @input="validate" suffix="s" min="0" type="number">
          <template #prepend>
            <i-mdi-ray-start-arrow />
          </template>
        </v-text-field>
        <v-text-field v-model.number="localSegment.End" :label="$t('segment.end')" :error-messages="validationError"
          @input="validate" suffix="s" min="0" type="number">
          <template #prepend>
            <i-mdi-ray-end-arrow />
          </template>
        </v-text-field>
        <v-select v-model="localSegment.Type" :items="Object.values(MediaSegmentType)" :label="$t('segment.type')">
          <template #prepend>
            <i-mdi-movie />
          </template>
        </v-select>
        <v-select v-model="localSegment.Action" :items="Object.values(MediaSegmentAction)"
          :label="$t('segment.recaction')">
          <template #prepend>
            <i-mdi-play-pause />
          </template>
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn color="surface-variant" block @click="saveSegment">{{ $t('editor.saveSegment') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ItemDto, MediaSegment, MediaSegmentAction, MediaSegmentType } from '@/interfaces';
import { CREATOR_UUID } from '@/composables/constants'
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUtils} from '@/composables/utils'

const { getReadableTimeFromSeconds } = useUtils()
const { t } = useI18n()

interface Props {
  itemId: ItemDto["Id"],
}

const props = defineProps<Props>()
const emit = defineEmits(['saveSegment'])

const showDialog = ref(false)
const localSegment = reactive(new MediaSegment())

const validationError = ref('')
const validate = () => {
  validationError.value = (localSegment.Start >= localSegment.End) ? t('validation.StartEnd') : '';
}

const saveSegment = async () => {
  if (validationError.value != '') return

  showDialog.value = false
  // inject itemId and creatorId
  localSegment.ItemId = props.itemId
  localSegment.CreatorId = CREATOR_UUID
  emit('saveSegment', JSON.parse(JSON.stringify(localSegment)));
}
</script>
