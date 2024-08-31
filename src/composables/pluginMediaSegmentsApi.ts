import { useApiStore } from 'stores/api'

export function usePluginMediaSegmentsApi() {
  const { fetchWithAuthJson } = useApiStore()
  async function getMediaSegmentsApiPluginMeta() {

    const response = await fetchWithAuthJson('MediaSegmentsApi')
    return response
  }

  return { getMediaSegmentsApiPluginMeta }
}
