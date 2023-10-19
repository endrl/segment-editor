import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const users = ref(undefined)
  const openOptions = ref(false)
  const seriesAccordionInd = ref(0)

  return { users, openOptions, seriesAccordionInd }
},
  {
    persist: false,
  })
