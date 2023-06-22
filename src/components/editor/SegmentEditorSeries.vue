<template>
  <v-expansion-panels :model-value="0">
    <v-expansion-panel v-for="season in seasons" :key="season.Id" :title="season.Name" :value="season.IndexNumber">
      <template #text>
        <EditorSeasons :item="season">
        </EditorSeasons>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { ItemDto } from '@/interfaces';
import { useApi } from '@/composables/api';

interface Props {
  item: ItemDto
}

const props = defineProps<Props>()

const { getItems } = useApi();

// fetch seasons
const rseasons = await getItems(props.item.Id);
const seasons: ItemDto[] = rseasons.Items;
</script>

<style></style>
