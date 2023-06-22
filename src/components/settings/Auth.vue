<template>
  <div class="mb-2 text-red" v-if="!apiStore.validConnection">{{ $t('login.connect_fail') }}</div>
  <div class="mb-2 text-red" v-if="apiStore.validConnection && !apiStore.validAuth">{{ $t('login.auth_fail') }}</div>
  <v-text-field v-model="serverAddress" :rules="[address_rule]" :label="$t('login.server_address')"
    placeholder="http://jellyfin:8096"></v-text-field>
  <v-text-field v-model="apiStore.apiKey" :rules="[apikey_rule]" :label="$t('login.api_key')"
    placeholder="abc8c48c912f4e1199c5b350e8f469e5"></v-text-field>
  <v-btn color="primary" @click.prevent="apiStore.testConnection" block class="mt-2">{{ $t('login.test_conn') }}</v-btn>
</template>

<script lang="ts" setup>
import { useApiStore } from '@/store/api';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const apiStore = useApiStore();
const { t } = useI18n();

const apikey_rule = (v: string) => v && v.length == 32 || t('login.validation.api_key_invalid');
const address_rule = (v: string) => {
  try {
    new URL(v)
    return true
  } catch (error) {
    return t('login.validation.url_invalid');
  }
};

const serverAddress = computed({
  get() {
    return apiStore.serverAddress
  },
  set(newValue) {
    apiStore.serverAddress = newValue.endsWith('/') ? newValue.slice(0, -1) : newValue;
  }
})

</script>
