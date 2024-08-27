import { defineStore, storeToRefs } from 'pinia'
import { ref, watch, computed } from 'vue'
import { useApi } from 'src/composables/api'
import { useApiStore } from './api'
import { ItemDto, ItemType, VirtualFolderDto } from 'src/interfaces'

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

    if (coll.length)
      selectedCol.value = coll[0].ItemId
  }

  // reset localItems and get new one
  const getNewItems = async () => {
    const items = await getItems(selectedCol.value, 0)

    TotalRecordCount.value = items.TotalRecordCount
    StartIndex.value = items.StartIndex
    localItems.value.splice(0)
    localItems.value.push(...items.Items)
  }

  // push more items to localItems
  const pushMoreItems = (items: ItemDto[]) => {
    for (const item of items) {
      if (localItems.value.findIndex((el) => item.Id == el.Id) == -1) {
        localItems.value.push(item)
      }
    }
  }

  /**
   * Get more items if possible
   */
  const getMoreItems = async () => {
    if (TotalRecordCount.value > localItems.value.length) {
      const items = await getItems(selectedCol.value, StartIndex.value)
      StartIndex.value += 1
      localItems.value.push(...items.Items)
    }
  }
  // Transform Collection Type to Item Type
  const collectionToType = computed(() => {
    const col = collections.value.find((col: VirtualFolderDto) => col.ItemId == selectedCol.value)

    switch (col?.CollectionType) {
      case 'movies':
        return ItemType.Movie
      case 'tvshows':
        return ItemType.Series
      case 'music':
        return ItemType.MusicArtist
      default:
        return ''
    }

  })

  // apply items filter
  const filteredItems = computed(() => localItems.value.filter((item) => collectionToType.value == item.Type && item.Name.toLowerCase().includes(filterName.value.toLowerCase())))

  // Get and reset items whenever connection is io or collection changed
  watch([selectedCol, validConnection, validAuth], ([selcol, connection, auth]) => {

    if (connection && auth) {
      // on intial startup collections are empty. This is already in App.vue
      if (selcol == '')
        getCollectionss();

      getNewItems()
    }
  })

  // When auth changed check for server plugins state
  watch([validAuth], ([auth]) => {

    if (auth) {
      apiStore.testServerPluginSegmentsApi()
    }
  })

  return { localItems, collections, selectedCol, filteredItems, filterName, getCollectionss, getMoreItems, pushMoreItems }
})
