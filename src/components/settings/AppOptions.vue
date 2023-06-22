<template>
  <v-radio-group inline v-model="appStore.themeIndex" :label="$t('app.theme.title')">
    <v-radio :label="$t('app.theme.system')" :value="0"></v-radio>
    <v-radio :label="$t('app.theme.dark')" :value="1"></v-radio>
    <v-radio :label="$t('app.theme.light')" :value="2"></v-radio>
  </v-radio-group>
  <div class="text-subtitle-1 text-medium-emphasis mb-2">{{ $t('app.locale.title') }}</div>
  <v-select v-model="appStore.selectedLang" :items="langList" item-title="locale" item-value="code" persistent-hint
    single-line></v-select>
  <v-switch :label="$t('app.showVideoPlayer')" v-model="appStore.showVideoPlayer" color="primary"></v-switch>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/app';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const appStore = useAppStore();
const { t } = useI18n();

const langList = computed(() => appStore.SUPPORTED_LOCALES.map(l => { return { 'locale': t(`app.locale.${l}`), 'code': l } }));
</script>
