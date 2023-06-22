import { useApiStore } from "@/store/api"
import { ItemDto, MediaSegment } from "@/interfaces";

export function useSegmentApi() {
  const { fetchWithAuthJson, postJson, deleteJson } = useApiStore()

  // Get segments
  async function getSegments() {
    const query: Map<string, any> = new Map();

    const items = await fetchWithAuthJson('MediaSegment', query)
    return items;
  }

  // Get segments
  async function getSegmentsById(itemId: ItemDto["Id"]) {
    const query: Map<string, any> = new Map();
    query.set('itemId', itemId)

    const items = await fetchWithAuthJson('MediaSegment', query)
    return items;
  }

  /**
   * Update or create a media segment on server
   * @param segment segment
   */
  async function updateSegment(segment: MediaSegment) {
    const array = new Array(segment);
    postJson('MediaSegment', array)
  }

  /**
  * Delte a media segment on server
  * @param segment segment
  */
  async function deleteSegment(segment: MediaSegment) {
    const query: Map<string, any> = new Map();
    query.set('itemId', segment.ItemId)
    query.set('creatorId', segment.CreatorId)
    query.set('type', segment.Type)
    query.set('typeIndex', segment.TypeIndex)

    deleteJson('MediaSegment', undefined, query)
  }

  /**
  * Delte all media segments for itemId on server
  * @param segment segment
  */
  async function deleteSegmentsWithId(itemId: ItemDto['Id']) {
    const query: Map<string, any> = new Map();
    query.set('itemId', itemId)

    deleteJson('MediaSegment', undefined, query)
  }

  /**
  * Delte all media segments for creatorId on server
  * @param segment segment
  */
  async function deleteSegmentsWithCreator(creatorId: MediaSegment['CreatorId']) {
    const query: Map<string, any> = new Map();
    query.set('creatorId', creatorId)

    deleteJson('MediaSegment', undefined, query)
  }
  return { getSegments, getSegmentsById, updateSegment, deleteSegment, deleteSegmentsWithId, deleteSegmentsWithCreator }
}
