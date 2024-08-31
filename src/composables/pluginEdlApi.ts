import { ItemDto } from 'src/interfaces'
import { useApiStore } from 'stores/api'

export function usePluginEdlApi() {
  const { fetchWithAuthJson, postJson } = useApiStore()

  async function getEdlById(id: ItemDto) {

    // const response = await fetchWithAuthJson(`PluginEdl/Edl/${id}`)
    const response = await fetchWithAuthJson(`PluginEdl/Edl/${id}`)
    return response
  }

  async function createEdlById(id: string[]) {
    const response = await postJson('PluginEdl/Edl', id)
    return response
  }

  async function getEdlPluginMeta() {

    const response = await fetchWithAuthJson('PluginEdl')
    return response
  }

  return { getEdlById, createEdlById, getEdlPluginMeta }
}
