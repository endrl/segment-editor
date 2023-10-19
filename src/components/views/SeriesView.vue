<template>
  <div class="row items-center">
    <q-btn @click="$router.back()" color="primary" round>
      <i-mdi-chevron-left></i-mdi-chevron-left>
    </q-btn>
    <div class="q-ml-md text-h6">
      {{ seasons[0].SeriesName ? `${seasons[0].SeriesName}` : `seasons[0].Name` }}
    </div>
  </div>
  <div class="q-mt-md">
    <q-expansion-item group="series" ref="expansionRefs" v-for="(season, ind)  in  seasons " :key="season.Id"
      @click="setIndex(ind)" :label="`${season.Name}`" :value="season.IndexNumber">
      <q-card>
        <q-card-section>
          <EditorSeasons :item="season"></EditorSeasons>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script lang="ts" setup>
import { ItemDto } from 'src/interfaces';
import { useApi } from 'src/composables/api';
import { useRoute, useRouter } from 'vue-router'
import { useItemsStore } from 'stores/items'
import { useSessionStore } from 'stores/session';
import { ref } from 'vue';
import { onMounted } from 'vue';

const sessionStore = useSessionStore()
const { pushMoreItems } = useItemsStore()
const route = useRoute()
const router = useRouter()
const { getItems } = useApi();
const expansionRefs = ref([])

// get current item from params
const itemId = route.params.itemId
if (itemId === undefined) {
  router.push('/')
}

const setIndex = (ind: number) => { sessionStore.seriesAccordionInd = ind }

// recover accordion
onMounted(() => {
  try {
    expansionRefs.value[sessionStore.seriesAccordionInd].show();
  } catch (error) {
    sessionStore.seriesAccordionInd = 0
    expansionRefs.value[0].show();

  }
})

// fetch seasons
const rseasons = await getItems(itemId);
const seasons: ItemDto[] = rseasons.Items;
// push items into local cache
pushMoreItems(seasons)
</script>

<style></style>
