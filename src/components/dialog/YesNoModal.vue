<template>
  <v-card-title>{{ viewProps.title }}</v-card-title>
  <v-card-text>{{ viewProps.message }}</v-card-text>
</template>

<script lang="ts" setup>
// import { watch } from "vue";

interface ViewProps {
  title: string,
  message: string
}

interface Props {
  modelValue: any
  viewProps: ViewProps
}

defineProps<Props>()
// const emit = defineEmits(["update:modelValue"]);

/*
watch(() => props.modelValue, (value) => {
  emit("update:modelValue", value);
});
*/
</script>
