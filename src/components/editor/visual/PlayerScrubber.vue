<template>
  <div ref="scrubber" class="relative scrubber-container rounded select-none bg-black">
    <div class="relative overflow-hidden w-100 rounded cursor-pointer" @mousedown="scrubbing = true"
      style="height: 0.7rem">
      <div class="w-100 h-100 absolute bg-deep-purple-lighten-3 rounded opacity-40"
        :style="{ transform: `translateX(${secondary / max * 100 - 100}%)` }" />
      <div class="w-100 h-100 relative bg-deep-purple rounded"
        :style="{ transform: `translateX(${value / max * 100 - 100}%)` }" />
    </div>
    <div class="absolute scrubber-overlay">
      <slot :pending-value="pendingValue" :position="`${Math.max(0, Math.min(elementX, elementWidth)) - 40}px`" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEventListener, useMouseInElement, useVModel } from '@vueuse/core'
import { ref, watch } from 'vue';

const props = defineProps({
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  secondary: { type: Number, default: 0 },
  modelValue: { type: Number, required: true },
})

const emit = defineEmits(['update:modelValue'])
const scrubber = ref()
const scrubbing = ref(false)
const pendingValue = ref(0)

useEventListener('mouseup', () => scrubbing.value = false)

const value = useVModel(props, 'modelValue', emit)
const { elementX, elementWidth } = useMouseInElement(scrubber)

watch([scrubbing, elementX], () => {
  const progress = Math.max(0, Math.min(1, (elementX.value) / elementWidth.value))
  pendingValue.value = progress * props.max
  if (scrubbing.value)
    value.value = pendingValue.value
})
</script>

<style>
.scrubber-overlay {
  opacity: 0%;
}

.scrubber-container:hover .scrubber-overlay {
  opacity: 100%;
}
</style>
