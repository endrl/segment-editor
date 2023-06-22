import { useApiStore } from "@/store/api"
import { ItemDto } from "@/interfaces";
import { CREATOR_UUID } from "./constants";

export function useVideoApi() {
  const { buildUrl, postJson } = useApiStore()

    /**
   * Get a media stream url by id
   * Endpoint: Videos/itemId/master.m3u8 is HLS. HLS supports audio: aac, mp3 ac3, eac3. video container: fMP4, mp2ts
   * Doc: https://datatracker.ietf.org/doc/html/draft-pantos-http-live-streaming-20#section-3.1  -3.4
   * @param itemId itemId of media
   * @param forceVideoReason force transcode of video
   * @param forceAudioReason force transcode of audio
   * @param container ts, mp4, ...
   */
  function getVideoStream(itemId: ItemDto["Id"], forceVideoReason?:string, forceAudioReason?: string, container?: string) {
    const query: Map<string, any> = new Map();
    const transcodeReasons: string[] = [];
    query.set('MediaSourceId',itemId)

    // if there is no transcode, enable direct stream
    if (!forceAudioReason && !forceVideoReason){
      query.set('static',true)
    }
    if(forceAudioReason){
      transcodeReasons.push(`Audio not supported (${forceAudioReason})`)
      query.set('AudioCodec','aac')
      query.set('TranscodingMaxAudioChannels',2)
    }
    if(forceVideoReason){
      transcodeReasons.push(`Video not supported (${forceVideoReason}`)
      query.set('VideoCodec','h264')
    }
    if(transcodeReasons.length){
      query.set('transcodeReasons',transcodeReasons.join(','))
    }
    if (container){
      query.set('segmentContainer',container)
    }
    // skip session, we can't stop it without userId...
    // query.set('PlaySessionId',CREATOR_UUID)

    const baseUrl = `Videos/${itemId}/master.m3u8`;
    return buildUrl(baseUrl,query)
  }

  /**
   * Report end of playback. Requires userId from httpContext server side...
   * @param itemId
   */
  function reportPlayingStop(itemId: ItemDto["Id"]){
    const payload = {
      ItemId: itemId,
      MediaSourceId: itemId,
      PlaySessionId: CREATOR_UUID
    }
    postJson('Sessions/Playing/Stopped',payload)
  }

  return { getVideoStream, reportPlayingStop }
}
