<template>
  <div class="q-mt-sm">
    <div>{{ $t('app.theme.title') }}</div>
    <q-option-group v-model="appStore.themeIndex" :options="themeList" inline />
  </div>
  <div class="q-mt-sm">{{ $t('app.locale.title') }}</div>
  <q-select v-model="appStore.selectedLang" :options="langList" emit-value map-options />
  <div class="q-mt-sm"></div>

  <q-toggle :label="$t('app.showVideoPlayer')" v-model="appStore.showVideoPlayer" />
</template>

<script lang="ts" setup>
import { useAppStore } from 'stores/app';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const appStore = useAppStore();
const { t } = useI18n();

const langList = computed(() => appStore.SUPPORTED_LOCALES.map(l => { return { 'label': t(`app.locale.${l}`), 'value': l } }));
const themeList = computed(() => ['system', 'dark', 'light'].map((th, idx) => { return { label: t(`app.theme.${th}`), value: idx } }));
</script>
