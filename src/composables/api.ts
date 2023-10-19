import { useApiStore } from 'stores/api'

import * as fetch from './fetch'
import { ImageType, VirtualFolderDto } from 'src/interfaces';

export function useApi() {
  const { fetchWithAuthJson, fetchWithAuth } = useApiStore()
  /*
    type RequestBody = {
      userId: number
      title: string
      body: string
    }

    type ResponseBody = RequestBody & {
      id: string
    }

    const newPost = {
      userId: 1,
      title: 'my post',
      body: 'some content',
    }

    const response = await fetch.post<RequestBody, ResponseBody>(
      'https://jsonplaceholder.typicode.com/posts',
      newPost,
    )
  */

  // Get items for collection
  async function getItems(collectionId: string, index?: number) {
    const query: Map<string, any> = new Map();
    query.set('parentId', collectionId);
    query.set('fields', 'MediaStreams')
    if (index != undefined) {
      // TODO all broken?!?!
      //query.set('startIndex', index)
      //query.set('parentIndexNumber', index)
      //query.set('searchTerm', 'Ava')
      //query.set('limit', '5')
    }

    const items = await fetchWithAuthJson('Items', query)
    return items;
  }

  // Get all collections
  async function getCollections() {
    const collections: VirtualFolderDto[] = await fetchWithAuthJson('Library/VirtualFolders')
    return collections
  }

  // Get Image for item
  async function getImage(itemId: string, width = 133, height = 200, type: ImageType = ImageType.Primary) {
    const query: Map<string, any> = new Map();

    query.set('tag', `segmenteditor_${itemId}_${type}`);
    query.set('width', width);
    query.set('height', height);

    const image = await fetchWithAuth(`Items/${itemId}/Images/${type}`)
    return image
  }

  return { getItems, getImage, getCollections }
}
