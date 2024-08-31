import { defineStore } from 'pinia'
import { MediaSegment } from 'src/interfaces'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const users = ref(undefined)
  const openOptions = ref(false)
  const seriesAccordionInd = ref(0)
  const segmentClipboard = ref<MediaSegment>()

  const saveSegmentToClipboard = (seg: MediaSegment) => {
    segmentClipboard.value = JSON.parse(JSON.stringify(seg))
  }

  const getFromSegmentClipboard = () => {
    if (segmentClipboard.value)
      return JSON.parse(JSON.stringify(segmentClipboard.value))
    return undefined
  }

  return { users, openOptions, seriesAccordionInd, saveSegmentToClipboard, getFromSegmentClipboard }
},
  {
    persist: false,
  })
