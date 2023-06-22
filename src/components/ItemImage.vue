<template>
  <div class="relative">
    <BlurhashImg :width="width" :height="height" :item="item" class="absolute top-0 left-0" />
    <Transition name="fade">
      <img v-show="isLoaded" v-intersect="onIntersect" ref="image" :width="width" :height="height"
        class="absolute top-0 left-0">
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
import { useApi } from '@/composables/api'
import { useUtils } from '@/composables/utils'
import { ItemDto } from '@/interfaces'

const { getImage } = useApi()
const { getImageOfStream } = useUtils()

const isLoaded = ref(false)
const image = ref(undefined)

const props = withDefaults(defineProps<Props>(), {
  width: 32,
  height: 32,
})


const onIntersect = () => {
  getImage(props.item.Id, props.width, props.height).then((response) => getImageOfStream(response)).then((url) => {
    image.value.src = url
  })
  image.value.onload = () => {
    isLoaded.value = true
  }
}

</script>

<style>
.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.top-0 {
  top: 0;
}

.left-0 {
  left: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
