import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useApiStore = defineStore('api', () => {
  const apiKey = ref(undefined)
  const serverAddress = ref('http://localhost:8096')
  const validConnection = ref(false)
  const validAuth = ref(false)
  let pluginAuthHeader: HeadersInit | undefined = undefined

  // When we run as plugin we inject address and auth
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if ((window.ApiClient as any)) {
    console.log('Running as Jellyfin Plugin')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    serverAddress.value = ApiClient.serverAddress()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    pluginAuthHeader = { 'MediaBrowser Token': ApiClient.accessToken() }

  }

  const fetchWithAuth = async (endpoint: string, query?: Map<string, string>) => {
    const reqInit: RequestInit = {
      method: 'GET',
      headers: pluginAuthHeader,
    };

    const response = await fetch(buildUrl(endpoint, query), reqInit);
    return response;
  }

  /**
   * Builds a final url from endpoint and query with server address and auth
   * @param endpoint endpoint to reach
   * @param query optoinal query
   * @returns new url
   */
  const buildUrl = (endpoint: string, query?: Map<string, string>): RequestInfo => {
    let queryString = ''
    if (!pluginAuthHeader)
      queryString = `&ApiKey=${apiKey.value}`;

    query?.forEach((value, key) => queryString += `&${key}=${value}`)
    if (queryString.length > 1)
      queryString = '?' + queryString.slice(1);

    return `${serverAddress.value}/${endpoint}${queryString}`
  }

  /**
   * Send post message to server
   * @param body the body to post
   */
  const postJson = async (endpoint: string, body: string | any) => {
    let headers: HeadersInit = {
      'Content-Type': 'application/json'
    }

    if (pluginAuthHeader) {
      headers = Object.assign(headers, pluginAuthHeader)
    }

    const reqInit: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    };
    const response = await fetch(buildUrl(endpoint), reqInit);

    // filter for broken access
    if (response.status == 401) {
      validAuth.value = false
    }

    // filter for broken request
    if (response.status == 400) {
      console.error('post response', response)
      return
    }

    validConnection.value = response.ok
    const jsonData = await response.json();
    return jsonData;
  }

  /**
 * Send delete message to server
 * @param body the body to post
 */
  const deleteJson = async (endpoint: string, body?: string, query?: Map<string, string>) => {
    const reqInit: RequestInit = {
      method: 'DELETE',
      body: JSON.stringify(body),
      headers: pluginAuthHeader,
    };
    const response = await fetch(buildUrl(endpoint, query), reqInit);

    // filter for broken access
    if (response.status == 401) {
      validAuth.value = false
    }

    validConnection.value = response.ok
    const jsonData = await response.json();
    return jsonData;
  }

  const testConnection = async () => {
    let response;
    try {
      response = await fetchWithAuth('System/Info');
    } catch (error) {
      validConnection.value = false
      validAuth.value = false
      return false
    }

    validAuth.value = response.status != 401
    validConnection.value = response.ok
    return response.ok && validAuth.value
  }

  const fetchWithAuthJson = async (endpoint: string, query?: Map<string, string>) => {
    const response = await fetchWithAuth(endpoint, query);
    // filter for broken access
    if (response.status == 401) {
      validAuth.value = false
      return [];
    }

    const jsonData = await response.json();
    return jsonData;
  }

  return { apiKey, serverAddress, validConnection, validAuth, fetchWithAuthJson, fetchWithAuth, testConnection, postJson, deleteJson, buildUrl }
})
