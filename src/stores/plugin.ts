import { defineStore, storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { useApiStore } from './api';
import { usePluginEdlApi } from 'src/composables/pluginEdlApi';
import { usePluginMediaSegmentsApi } from 'src/composables/pluginMediaSegmentsApi';
import { useAppStore } from './app';


export const usePluginStore = defineStore('plugin', () => {
  const apiStore = useApiStore()
  const appStore = useAppStore()
  const { getEdlPluginMeta } = usePluginEdlApi()
  const { getMediaSegmentsApiPluginMeta } = usePluginMediaSegmentsApi()
  const { validAuth } = storeToRefs(apiStore)
  const { enableEdl } = storeToRefs(appStore)


  const pluginSegmentsApiInstalled = ref(false)
  const pluginSegmentsApiVersion = ref('0.0.0')

  const pluginEdlInstalled = ref(false)
  const pluginEdlVersion = ref('0.0.0')

  // Test for installed server Plugins
  const testServerPlugins = async () => {
    testMediaSegmentsApi()
    testEdl()
  }

  const testMediaSegmentsApi = async () => {
    let response;
    try {
      response = await getMediaSegmentsApiPluginMeta();

    } catch (error) {
      console.error('testPluginSegmentsApi Error', error)
      return false
    }
    if (response && response.version) {
      pluginSegmentsApiInstalled.value = true
      pluginSegmentsApiVersion.value = response.version
      return
    }
    pluginSegmentsApiInstalled.value = false
    pluginSegmentsApiVersion.value = '0.0.0'
  }

  const testEdl = async () => {
    let response;
    try {
      response = await getEdlPluginMeta();

    } catch (error) {
      console.error('testEdl Error', error)
      return false
    }
    if (response && response.version) {
      pluginEdlInstalled.value = true
      pluginEdlVersion.value = response.version
      return
    }
    pluginEdlInstalled.value = false
    pluginEdlVersion.value = '0.0.0'
  }

  // check if we should show edl handling
  const showEdlBtn = () => {
    return pluginEdlInstalled.value && enableEdl.value
  }

  // When auth changed check for server plugins state
  watch([validAuth], ([auth]) => {

    if (auth) {
      testServerPlugins()
    }
  })



  return { pluginSegmentsApiInstalled, pluginSegmentsApiVersion, pluginEdlInstalled, pluginEdlVersion, showEdlBtn, testServerPlugins }
}, {
  persist: {
    storage: sessionStorage,
  },
})
