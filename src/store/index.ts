// Utilities
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const persistedState = createPersistedState({
  auto: true,
})

const pinia = createPinia()
pinia.use(persistedState)

export default pinia
