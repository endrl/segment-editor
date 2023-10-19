<template>
  <template v-for="episode in episodes" :key="episode.Id">
    <div class="row nowrap">
      <div class="q-mr-sm q-my-sm season-episode-poster">
        <ItemImage :width="124" :height="70" :item="episode"></ItemImage>
      </div>
      <div class="col-grow">
        <div class="row items-center q-mt-sm">
          <span>S{{ episode.ParentIndexNumber }}E{{ episode.IndexNumber
          }}</span>
          <span class="q-ml-xs" v-if="!episode.Name.includes('Episode')">- {{
            episode.Name
          }}
          </span>
        </div>

        <SegmentsBar :item="episode"></SegmentsBar>

      </div>
    </div>

  </template>
</template>

<script setup lang="ts">
import { ItemDto } from 'src/interfaces';
import { useApi } from 'src/composables/api';
import { useItemsStore } from 'stores/items'

const { pushMoreItems } = useItemsStore()
const { getItems } = useApi();

interface Props {
  item: ItemDto
}

const props = defineProps<Props>()

// fetch episodes of season
const repisodes = await getItems(props.item.Id);
const episodes: ItemDto[] = repisodes.Items;

// push items
pushMoreItems(episodes)
</script>

<style>
.season-episode-poster {
  width: 124px;
  height: 70px
}
</style>
