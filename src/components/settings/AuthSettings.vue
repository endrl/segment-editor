<template>
  <div class="text-h6">Server</div>

  <div class="q-mb-md text-red" v-if="!apiStore.validConnection">{{ t('login.connect_fail') }}</div>
  <div class="q-mb-md text-red" v-if="apiStore.validConnection && !apiStore.validAuth">{{ t('login.auth_fail') }}</div>
  <q-input v-model="serverAddress" :rules="[address_rule]" :label="t('login.server_address')"
    placeholder="http://jellyfin:8096"></q-input>
  <q-input v-model="apiKey" :rules="[apikey_rule]" :label="t('login.api_key')"
    placeholder="abc8c48c912f4e1199c5b350e8f469e5"></q-input>
  <q-btn class="q-mt-sm" color="primary" @click.prevent="apiStore.testConnection">{{ t('login.test_conn') }}</q-btn>
</template>

<script lang="ts" setup>
import { useApiStore } from 'stores/api';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const apiStore = useApiStore();
const { t } = useI18n();

const apikey_rule = (v: string) => v && v.trim().length == 32 || t('login.validation.api_key_invalid');
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

const apiKey = computed({
  get() {
    return apiStore.apiKey
  },
  set(newValue) {
    if (newValue) newValue = newValue.trim()
    apiStore.apiKey = newValue;
  }
})

</script>
