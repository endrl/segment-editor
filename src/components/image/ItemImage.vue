<template>
  <div class="relative-position">
    <BlurhashImage :width="width" :height="height" :item="item" class="absolute-top-left" />
    <Transition name="fade">
      <img v-show="isLoaded" v-intersection.once="onIntersect" ref="image" :width="width" :height="height"
        class="absolute-top-left">
    </Transition>
  </div>
</template>

<script lang="ts">
interface Props {
  item: ItemDto,
  width: number,
  height: number,
  preferBackdrop?: boolean
}
</script>

<script setup lang = "ts" >
import { ref } from 'vue'
import { useApi } from 'src/composables/api'
import { useUtils } from 'src/composables/utils'
import { ItemDto } from 'src/interfaces'

const { getImage } = useApi()
const { getImageOfStream } = useUtils()

const isLoaded = ref(false)
const image = ref<HTMLImageElement | undefined>(undefined)

const props = withDefaults(defineProps<Props>(), {
  width: 32,
  height: 32,
})

const onIntersect = () => {
  getImage(props.item.Id, props.width, props.height).then((response) => getImageOfStream(response)).then((url) => {
    if (image.value) {
      image.value.src = url
    }
  })
  if (image.value) {
    image.value.onload = () => {
      isLoaded.value = true
    }
  }
}

</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
