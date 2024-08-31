<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        {{ edlData.edl }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn color="primary" label="GetEdlData" @click="getEdlData" />
        <q-btn color="primary" label="writeEdlData" @click="writeEdlData" />
        <q-btn color="primary" label="OK" @click="onOKClick" />
        <q-btn color="primary" label="Cancel" @click="onDialogCancel" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { usePluginEdlApi } from 'src/composables/pluginEdlApi'
import { ref } from 'vue';

let edlData = ref('');

const props = defineProps<{
  item: ItemDto
}>()

const { createEdlById, getEdlById } = usePluginEdlApi()
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome



defineEmits([
  // REQUIRED; need to specify some events that your
  // component will emit through useDialogPluginComponent()
  ...useDialogPluginComponent.emits
])


// this is part of our example (so not required)
function onOKClick() {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)
  onDialogOK()
  // or with payload: onDialogOK({ ... })
  // ...and it will also hide the dialog automatically
}

const getEdlData = async () => {
  edlData.value = await getEdlById(props.item.Id)
  console.log(edlData.value)
}

const writeEdlData = async () => {
  await createEdlById([props.item.Id])
}
</script>
