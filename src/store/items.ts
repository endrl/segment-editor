import { defineStore, storeToRefs } from 'pinia'
import { ref, watch, computed } from 'vue'
import { useApi } from '@/composables/api'
import { useApiStore } from './api'
import { ItemDto, VirtualFolderDto } from '@/interfaces'

export const useItemsStore = defineStore('items', () => {
  const { getItems, getCollections } = useApi()
  const apiStore = useApiStore()
  const { validConnection, validAuth } = storeToRefs(apiStore)

  const collections = ref<Array<VirtualFolderDto>>([])
  const localItems = ref<Array<ItemDto>>([])

  const selectedCol = ref('')
  const TotalRecordCount = ref(0)
  const StartIndex = ref(0)
  const filterName = ref('')

  const getCollectionss = async () => {
    const coll = await getCollections()
    collections.value = coll;
  }

  // reset localItems and get new one
  const getNewItems = async () => {
    const items = await getItems(selectedCol.value)
    TotalRecordCount.value = items.TotalRecordCount
    StartIndex.value = items.StartIndex
    localItems.value.splice(0)
    localItems.value.push(...items.Items)
  }

  // apply items filter
  const filteredItems = computed(() => localItems.value.filter((item) => item.Name.toLowerCase().includes(filterName.value.toLowerCase())))

  // Get and reset items whenever connection is io or collection changed
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  watch([selectedCol, validConnection, validAuth], ([newcol, connection, auth]) => {
    if (connection && auth) { getNewItems() }
  })

  return { localItems, collections, selectedCol, filteredItems, filterName, getCollectionss }
})
