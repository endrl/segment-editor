<template>
  <div class="row q-mb-sm">
    <div>
      <q-select style="width:250px" :label="$t('items.filter.collection')" dense :options="itemStore.collections"
        v-model="itemStore.selectedCol" emit-value map-options option-label="Name" option-value="ItemId"></q-select>
    </div>
    <div class="q-ml-sm">
      <q-input style="width:250px" :label="$t('items.filter.name')" dense v-model="itemStore.filterName">
      </q-input>
    </div>
  </div>
  <div class="row items-left">
    <q-intersection v-for="item in itemStore.filteredItems" :key="item.Id"
      class="q-ma-sm movie-container cursor-pointer relative-position" @click="navigateTo(item)">
      <ItemImage :width="133" :height="200" :item="item">
      </ItemImage>
      <div class="text-ellipsis text-center absolute movie-container-subtext">
        {{ item.Name }}
      </div>
    </q-intersection>
  </div>
  <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
    <q-btn fab color="accent">
      <i-mdi-keyboard-arrow-up></i-mdi-keyboard-arrow-up>
    </q-btn>
  </q-page-scroller>
  <!--
  <q-intersection class="full-width row items-center justify-center" style="height:50px" @visibility="loadData">
    <div>Loading data!</div>
  </q-intersection>
  -->
</template>

<script lang="ts" setup>
import { ItemType, ItemDto } from 'src/interfaces';
import { useItemsStore } from 'stores/items';
import { useRouter } from 'vue-router';

const router = useRouter()
const itemStore = useItemsStore()
/*
const loadData = (isVisible: boolean) => {
  if (isVisible) {
    itemStore.getMoreItems()
  }
}
*/

const navigateTo = (item: ItemDto) => {
  let route = ''
  if (item.Type == ItemType.Movie) {
    route = `/player/${item.Id}?fetchSegments=true`
  } else if (item.Type == ItemType.Series) {
    route = `/series/${item.Id}`
  } else if (item.Type == ItemType.MusicArtist) {
    route = `/artist/${item.Id}`
  }
  router.push(route)
}
</script>

<style>
.movie-container {
  width: 133px;
  height: 224px;
}

.movie-container-subtext {
  bottom: 0px;
  height: 20px;
  width: 133px;
}

.movie-container-hover {
  transition: 0.5s;
}

.movie-container-hover:hover {
  transform: scale(1.05);
}
</style>
