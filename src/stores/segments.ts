import { useSegmentApi } from 'src/composables/segmentApi'
import { ItemDto, MediaSegment } from 'src/interfaces'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSegmentsStore = defineStore('segments', () => {
  const sapi = useSegmentApi()
  const localSegments = ref<Array<MediaSegment>>([])

  /**
 *  reset segments and get new one
 */
  const getNewSegments = async () => {
    const segments = await sapi.getSegments()
    localSegments.value.splice(0)
    localSegments.value.push(...segments.Items)
  }
  /**
*  Gather new segments by id from server, deletes local cached ones
*/
  const getNewSegmentsById = async (itemId: ItemDto['Id']) => {
    const segments = await sapi.getSegmentsById(itemId)
    // simply filter and replace array
    localSegments.value = localSegments.value.filter((seg: MediaSegment) => seg.ItemId != itemId)
    // push new segments
    localSegments.value.push(...segments.Items)
  }


  /**
   * Save/update segments local and server
   * @param segment MediaSegment to save
   */
  const saveSegment = (segment: MediaSegment) => {
    // update local and server
    localSegments.value.push(segment)
    sapi.updateSegment(segment)
  }


  /**
   * Update segment
   * @param segment Modified segment
   */
  const saveUpdatedSegment = (segment: MediaSegment) => {
    // check if segment is already available, if so remove it
    const found = localSegments.value.findIndex((seg: MediaSegment) => seg.Type == segment.Type && seg.TypeIndex == segment.TypeIndex && seg.ItemId == segment.ItemId)
    if (found > -1) {
      localSegments.value.splice(found, 1)
    }
    saveSegment(segment)
  }

  /**
   * New segment to save
   * @param segment New segment
   */
  const saveNewSegment = (segment: MediaSegment) => {
    // check if segment is already available
    const found = localSegments.value.findIndex((seg: MediaSegment) => seg.Type == segment.Type && seg.ItemId == segment.ItemId)
    // a result means the TypeIndex neeeds to be incremented
    if (found > -1) {
      segment.TypeIndex = segment.TypeIndex + 1
    }
    saveSegment(segment)
  }

  /**
  * New segments to save
  * @param segments New segments
  */
  const saveNewSegments = (segments: MediaSegment[]) => {
    for (const seg of segments) {
      saveNewSegment(seg)
    }
  }

  /**
   * Delete segment
   * @param segment segment to delete
   */
  const deleteSegment = (segment: MediaSegment) => {
    // check if segment is available, if so remove it
    const found = localSegments.value.findIndex((seg: MediaSegment) => seg.Type == segment.Type && seg.TypeIndex == segment.TypeIndex && seg.ItemId == segment.ItemId)
    if (found > -1) {
      localSegments.value.splice(found, 1)
    }
    sapi.deleteSegment(segment)
  }

  /**
 * Delete all segments with itemid
 * @param itemId itemid of segments
 */
  const deleteSegments = (itemId: ItemDto['Id']) => {
    const found = localSegments.value.filter((seg: MediaSegment) => seg.ItemId == itemId)
    // simply filter and replace array
    localSegments.value = localSegments.value.filter((seg: MediaSegment) => seg.ItemId != itemId)
    if (found.length > 0)
      sapi.deleteSegmentsWithId(itemId)
  }


  return { getNewSegments, saveUpdatedSegment, saveNewSegment, saveNewSegments, deleteSegment, deleteSegments, getNewSegmentsById, localSegments }
})
