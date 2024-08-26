import { useApiStore } from 'stores/api'
import { ItemDto, MediaSegment } from 'src/interfaces';
import { useUtils } from './utils';

export function useSegmentApi() {
  const { fetchWithAuthJson, postJson, deleteJson } = useApiStore()
  const { secondsToTicks, ticksToMs } = useUtils()

  // Get segments. Convert ticks to seconds
  async function getSegmentsById(itemId: ItemDto['Id']) {
    const query: Map<string, string> = new Map();
    query.set('itemId', itemId)

    const items = await fetchWithAuthJson(`MediaSegments/${itemId}`, query)

    items.Items.forEach((seg: MediaSegment) => {
      seg.StartTicks = ticksToMs(seg.StartTicks) / 1000
      seg.EndTicks = ticksToMs(seg.EndTicks) / 1000
    });

    return items;
  }

  /**
   * Create a media segment on server. Convert seconds to ticks
   * @param segment segment
   * @return The created segments
   */
  async function createSegment(segment: MediaSegment) {
    const query: Map<string, string> = new Map();
    query.set('providerId', 'SegmentEditor')

    segment.StartTicks = secondsToTicks(segment.StartTicks)
    segment.EndTicks = secondsToTicks(segment.EndTicks)

    return postJson(`MediaSegmentsApi/${segment.ItemId}`, segment, query)
  }

  /**
  * Delte a media segment on server
  * @param segment segment
  */
  async function deleteSegment(segment: MediaSegment) {
    deleteJson(`MediaSegmentsApi/${segment.Id}`)
  }

  /**
  * Delete all media segments for providerId on server
  * @param segment segment
  */
  async function deleteSegmentsByProviderId(itemId: ItemDto['Id']) {
    itemId
    console.error('deleteSegmentsByProviderId not possible')
  }

  return { getSegmentsById, createSegment, deleteSegment, deleteSegmentsByProviderId }
}
