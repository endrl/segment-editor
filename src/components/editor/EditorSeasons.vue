<template>
  <template v-for="episode in episodes" :key="episode.Id">
    <div class="d-flex flex-nowrap">
      <div class="mr-2 my-2 season-episode-poster">
        <ItemImage :width="124" :height="70" :item="episode"></ItemImage>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex align-center">
          <p class="text-medium-emphasis text-subtitle-1">S{{ episode.ParentIndexNumber }}E{{ episode.IndexNumber }}</p>
          <p class="text-medium-emphasis text-subtitle-2 ml-1" v-if="!episode.Name.includes('Episode')">- {{ episode.Name
          }}
          </p>
        </div>
        <EditorBar :item="episode"></EditorBar>
      </div>
    </div>

  </template>
</template>

<script setup lang="ts">
import { ItemDto } from '@/interfaces';
import { useApi } from '@/composables/api';

const { getItems } = useApi();

interface Props {
  item: ItemDto
}

const props = defineProps<Props>()

// fetch episodes of season
const repisodes = await getItems(props.item.Id);
const episodes: ItemDto[] = repisodes.Items;
</script>

<style>
.season-episode-poster {
  width: 124px;
  height: 70px
}
</style>
