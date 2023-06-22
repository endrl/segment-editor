<template>
  <v-container fluid>
    <div class="d-flex flex-row">
      <div>
        <v-select style="width:250px" :label="$t('items.filter.collection')" density="compact"
          :items="itemStore.collections" v-model="itemStore.selectedCol" item-title="Name" item-value="ItemId"></v-select>
      </div>
      <div class="ml-2">
        <v-text-field style="width:250px" :label="$t('items.filter.name')" density="compact"
          v-model="itemStore.filterName">
        </v-text-field>
      </div>
    </div>
    <div class="d-flex align-left flex-wrap">
      <div v-for="item in itemStore.filteredItems" :key="item.Id"
        class="ma-2 movie-container cursor-pointer position-relative" @click.prevent="showEditorForId(item)">
        <ItemImage :width="133" :height="200" :item="item">
        </ItemImage>
        <div class="text-overflow position-absolute movie-container-subtext text-medium-emphasis">
          {{ item.Name }}
        </div>
      </div>
    </div>
    <v-dialog v-model="dialog" fullscreen>
      <v-card>
        <v-card-title>
          {{ item?.Name }}
          <v-btn flat style="float:right" @click="dialog = false"><v-icon><i-mdi-close /></v-icon></v-btn>
        </v-card-title>
        <v-card-text>
          <SegmentEditor :item="item"></SegmentEditor>
        </v-card-text>
        <v-card-actions>
          <v-btn block @click="dialog = false">{{ $t('close') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script lang="ts" setup>
import { ItemDto } from '@/interfaces';
import { useItemsStore } from '@/store/items';
import { ref } from 'vue';

const itemStore = useItemsStore()

const dialog = ref(false)
const item = ref<ItemDto>()

const showEditorForId = (iitem: ItemDto) => { item.value = iitem; dialog.value = !dialog.value }

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

.cursor-pointer {
  cursor: pointer;
}

.text-overflow {
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
