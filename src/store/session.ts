import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSessionStore = defineStore('session', () => {
  const users = ref(undefined)
  const openOptions = ref(false)

  return { users, openOptions }
},
  {
    persist: false,
  })
