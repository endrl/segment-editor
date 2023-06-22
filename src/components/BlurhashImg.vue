<template>
  <canvas ref="canvas" :width="width" :height="height" />
</template>

<script lang="ts">
import { wrap } from 'comlink';
import BlurhashWorker from '@/composables/BlurhashWorker?worker&inline';

interface Props {
  item: ItemDto,
  punch?: number,
  width?: number,
  height?: number
}

const worker = new BlurhashWorker();
const pixelWorker = wrap<typeof import('@/composables/BlurhashWorker')['default']>(worker);
</script>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { ItemDto } from '@/interfaces';

const props = withDefaults(defineProps<Props>(), {
  width: 32,
  height: 32,
  punch: 1
})

const pixels = ref<Uint8ClampedArray | undefined>(undefined);
const canvas = ref<HTMLCanvasElement | undefined>(undefined);

watch([props, canvas], async () => {
  if (canvas.value) {
    const context = canvas.value.getContext('2d');
    const imageData = context?.createImageData(props.width, props.height);

    try {
      pixels.value = await pixelWorker(
        getBlurImageOfItem(props.item),
        props.width,
        props.height,
        props.punch
      );
    } catch {
      pixels.value = undefined;
      // emit('error');

      return;
    }

    if (imageData && context) {
      imageData.data.set(pixels.value);
      context.putImageData(imageData, 0, 0);
    }
  }
});

const getBlurImageOfItem = (item: ItemDto) => { return Object.values(item.ImageBlurHashes.Primary)[0] }
</script>
