import { BaseMediaStream } from "@/interfaces";

export function useMediaCapabilities() {

  /**
   * Convert profile to browser codec digits
   * FFmpeg Profile: https://trac.ffmpeg.org/wiki/Encode/H.264#Profile
   * MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#iso_base_media_file_format_mp4_quicktime_and_3gp
   * @param prof AVC Profile
   * @return PPCC digits
   */
  const getAvcProfile = (prof: string): string | undefined => {
    switch (prof) {
      case 'Constrained Baseline':
        return '4240'
      case 'Baseline':
        return '4200'
      case 'Extended':
        return '5800'
      case 'Main':
        return '4D00'
      case 'High':
        return '6400'
      case 'Progressive High':
        return '6408'
      case 'Constrained High':
        return '640C'
      case 'High 10':
        return '6E00'
      case 'High 4:2:2':
        return '7A00'
      case 'High 4:4:4 Predictive':
        return 'F400'
      case 'High 10 Intra':
        return '6E10'
      case 'High 4:2:2 Intra':
        return '7A10'
      case 'High 4:4:4 Intra':
        return 'F410'
      case 'CAVLC 4:4:4 Intra':
        return '4400'
      case 'Scalable Baseline ':
        return '5300'
      case 'Scalable Constrained Baseline':
        return '5304'
      case 'Scalable High':
        return '5600'
      case 'Scalable Constrained High':
        return '5604'
      case 'Scalable High Intra':
        return '5620'
      case 'Stereo High':
        return '8000'
      case 'Multiview High':
        return '7600'
      case 'Multiview Depth High':
        return '8A00'
      default:
        console.error("Unhandled AVC Profile:", prof)
        break;
    }
  }


  /**
   * Convert profile to browser codec digits
   * FFmpeg Profile: https://trac.ffmpeg.org/wiki/Encode/H.264#Profile
   * MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#iso_base_media_file_format_mp4_quicktime_and_3gp
   * Copied from: https://tools.axinom.com/capabilities/media
   * TODO: Find proper docs to create this list seperated instead of array
   * @param prof Profile
   * @return digits
   */
  const getHevcProfile = (prof: string): string[] => {
    switch (prof) {
      case 'Main':
        return ['1.6', 'B0']
      case 'Main 10':
        return ['2.4', 'B0']
      case 'Main 12':
        return ['4.16', 'B9.88']
      case 'Main Intra':
        return ['4.16', 'BF.A8']
      case 'Main 4:4:4':
        return ['4.16', 'BE.A8']
      case 'Main 4:4:4 Intra':
        return ['4.16', 'BE.28']
      case 'Main 10 Intra':
        return ['4.16', 'BD.A8']
      case 'Main 4:2:2 10':
        return ['4.16', 'BD.28']
      case 'Main 4:2:2 Intra':
        return ['4.16', 'BD.08']
      case 'Main 4:4:4 10':
        return ['4.16', 'BC.08']
      case 'Main 4:4:4 10 Intra':
        return ['4.16', 'BC.28']
      case 'Main 12 Intra':
        return ['4.16', 'B9.A8']
      case 'Main 4:2:2 12':
        return ['4.16', 'B9.28']
      case 'Main 4:2:2 12 Intra':
        return ['4.16', 'B9.08']
      case 'Main 4:4:4 12':
        return ['4.16', 'B8.08']
      case 'Main 4:4:4 12 Intra':
        return ['4.16', 'BC.28']
      case 'Main 4:4:4 16':
        return ['4.16', 'B8.20']
      case 'Monochrome':
        return ['4.16', 'BF.C8']
      case 'Monochrome 10':
        return ['4.16', 'BD.C8']
      case 'Monochrome 12':
        return ['4.16', 'B9.C8']
      case 'Monochrome 16':
        return ['4.16', 'B1.C8']
      case 'Screen-Extended':
        return ['9.512', 'BF.8C']
      case 'Screen-Extended Main 4:4:4':
        return ['9.512', 'BE.0C']
      case 'Screen-Extended Main 10':
        return ['9.512', 'BD.8C']
      case 'Screen-Extended Main 4:4:4 10':
        return ['9.512', 'BC.0C']
      case 'Screen-Extended High Throughput 4:4:4':
        return ['9.512', 'BE.0C']
      case 'Screen-Extended High Throughput 4:4:4 10':
        return ['9.512', 'BC.0C']
      case 'Screen-Extended High Throughput 4:4:4 14':
        return ['9.512', 'B0.0C']
      case 'High Throughput 4:4:4':
        return ['5.32', 'BE.0C']
      case 'High Throughput 4:4:4 10':
        return ['5.32', 'BC.0C']
      case 'High Throughput 4:4:4 14':
        return ['5.32', 'B0.0C']
      case 'High Throughput 4:4:4 16 Intro':
        return ['5.32', 'B0.24']
      default:
        console.error("Unhandled HEVC Profile:", prof)
        return ['1.6', 'B0']
    }
  }

  /**
   * Convert profile to browser codec digits
   * FFmpeg Profile: https://trac.ffmpeg.org/wiki/Encode/AV1
   * MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#av1
   * Spec: https://aomediacodec.github.io/av1-spec/#profiles
   * @param prof AVC Profile
   * @return P digit
   */
  const getAv1Profile = (prof: string): string | undefined => {
    switch (prof.toLowerCase()) {
      case 'main':
        return '0'
      case 'high':
        return '1'
      case 'professional':
        return '2'
      default:
        console.error("Unhandled AV1 Profile:", prof)
        break;
    }
  }

  /**
   * Get av1 codec specific sample digits
   * @param sampl pixel format
   */
  const getAv1Subsampling = (sampl: string) => {
    if (sampl.includes('yuv444')) {
      return '000'
    } else if (sampl.includes('yuv422')) {
      return '100'
    } else if (sampl.includes('yuv420')) {
      return '110'
    } else if (sampl.includes('yuv400')) {
      return '111'
    }
  }

  /**
   * Get webm specific sample digits
   * @param sampl pixel format
   */
  const getWebmSubsampling = (sampl: string) => {
    if (sampl.includes('yuv420')) {
      return '00'
    } else if (sampl.includes('yuv422')) {
      return '02'
    } else if (sampl.includes('yuv444')) {
      return '03'
    }
  }

  /**
   * Transform h264 to browser codec
   * FFmpeg Profile: https://trac.ffmpeg.org/wiki/Encode/H.264#Profile
   * @param stream
   */
  const getCodecH264 = (stream: BaseMediaStream) => {
    // codec schema: avc1[.PPCCLL]
    const PPCC = getAvcProfile(stream.Profile)
    const LL = stream.Level.toString(16)
    return `avc1.${PPCC}${LL}`
  }

  /**
   * Transform av1 to browser codec
   * FFmpeg: https://trac.ffmpeg.org/wiki/Encode/AV1
   * MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#av1
   * Spec: https://aomediacodec.github.io/av1-spec/#annex-a-profiles-and-levels
   * @param stream
   */
  const getCodecAV1 = (stream: BaseMediaStream) => {
    // codec schema: cccc.P.LLT.DD[.M.CCC.cp.tc.mc.F]
    // const xlvl = 2 + (stream.Level >> 2)
    // const ylvl = (stream.Level & 3)

    const cccc = stream.CodecTag
    const P = getAv1Profile(stream.Profile)
    const LL = stream.Level < 10 ? `0${stream.Level}` : stream.Level;
    const T = 'M' // seq_tier derived from ?!, available from xlvl >= 4 which can be set to 'H' for high tier
    const DD = stream.BitDepth < 10 ? `0${stream.BitDepth}` : stream.BitDepth;
    const CCC = getAv1Subsampling(stream.PixelFormat)
    const M = CCC ? (CCC == '111' ? 1 : 0) : undefined;

    let codec = `${cccc}.${P}.${LL}${T}.${DD}`
    // optional info
    if (M != undefined) {
      codec += `.${M}.${CCC}`
    }
    return codec
  }

  /**
   * Get hevc browser codec. TODO: Missing docs for codec schema!
   * FFmpeg Profile: https://trac.ffmpeg.org/wiki/Encode/H.265#Profile
   * Help: https://github.com/StaZhu/enable-chromium-hevc-hardware-decoding#mediacapabilities
   * Spec: https://x265.readthedocs.io/en/master/cli.html#profile-level-tier
   * @param stream
   */
  const getCodecHevc = (stream: BaseMediaStream) => {
    // codec schema UNKNOWN: ccc.P.LLT.DD[.M.CCC.cp.tc.mc.F]
    // fallback if CodecTag is not available
    const cccc = stream.CodecTag ?? 'hev1';
    const X = getHevcProfile(stream.Profile)
    const T = 'L' // Main Tier = L, High Tier = H (high requires profile >= 4.0) stream.Level >= 120 (decimal)
    const L = stream.Level

    return `${cccc}.${X[0]}.${T}${L}.${X[1]}`
  }

  /** Get codec (VP8,VP9) string for WebM container format
   * MDN: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#webm
   * Spec: https://www.webmproject.org/vp9/mp4/
   * @param stream
   */
  const getCodecWebM = (stream: BaseMediaStream) => {
    // codec schema cccc.PP.LL.DD[.CC.cp.tc.mc.FF]
    const cccc = stream.Codec === 'vp9' ? 'vp09' : 'vp08'
    // vp9 test file had "Profile 0" as profile string, ffmpeg probe test confirmed the bug
    const cleanProfile = stream.Profile.includes("Profile") ? stream.Profile.substring(stream.Profile.length - 1) : stream.Profile;
    const PP = cleanProfile.length == 1 ? '0' + cleanProfile : cleanProfile;
    const LL = stream.Level < 10 ? 10 : stream.Level; // vp8,vp9 test file got -99, so set to 10 as fallback
    const DD = stream.BitDepth < 10 ? `0${stream.BitDepth}` : stream.BitDepth;
    const CC = getWebmSubsampling(stream.PixelFormat);
    let codec = `${cccc}.${PP}.${LL}.${DD}`

    if (CC) {
      codec += `.${CC}`
    }
    return codec
  }

  /**
   * transform from ffmpeg codec to browser codec definition
   * @param stream the stream
   * @returns audio codec
   */
  const getAudioCodec = (stream: BaseMediaStream) => {
    switch (stream.Codec) {
      case "aac":
        return "mp4a.40.2" // .2 -> AAC-LC, .5 -> AAC-HE, .29 -> AAC-HE v2
      case "mp3":
        return "mp4a.6B" // 6B -> MPEG-1 Part 3, 69 -> MPEG-2 Part 3
      case "ac3": // Dolby Digital
        return "ac-3"
      case "eac3": // Dolby Digital Plus
        return "ec-3"
      default:
        return `${stream.Codec}`
    }
  }


  /**
   * transform from ffmpeg codec to browser codec definition
   * @param stream the stream
   * @returns audio codec
   */
  const getVideoCodec = (stream: BaseMediaStream) => {
    switch (stream.Codec) {
      case "h264":
        return getCodecH264(stream)
      case "hevc": // h265
        return getCodecHevc(stream)
      case "av1":
        return getCodecAV1(stream)
      case "vp8":
      case "vp9":
        return getCodecWebM(stream)
      default:
        return stream.Codec
    }
  }

  /**
   * Get possible container for browser by codec
   * @param stream the stream
   * @returns possible containers
   */
  const getMediaContainer = (stream: BaseMediaStream) => {
    switch (stream.Codec) {
      case "h264":
        return ["mp4", "mp2ts"] // or mp2ts
      case "hevc": // h265
        return ["mp4"] // mp2ts not supported by hls.js. See https://github.com/video-dev/hls.js/issues/4943#issuecomment-1577457737
      case "av1":
        return ["mp4"] //  webm or mp2ts. (mp2ts is not supported by chrome), (vp9 with mp4 partly hangs in chrome for me) https://en.wikipedia.org/wiki/AV1#Supported_container_formats
      //     case "vp8":
      //     case "vp9":
      //     case "vorbis":
      //     case "opus":
      //       return ["webm"]
      default:
        return undefined
    }
  }

  /**
   * Build a configuration for video
   * @param stream the stream
   * @param withAudio Add audio
   * @returns new configuration
   */
  const getVideoConfiguration = (stream: BaseMediaStream): MediaDecodingConfiguration | undefined => {
    const videoCodec = getVideoCodec(stream)
    const container = getMediaContainer(stream)

    if (container) {
      return {
        type: "media-source",
        video: {
          contentType: `video/${container[0]};codecs="${videoCodec}"`,
          width: stream.Width,
          height: stream.Height,
          bitrate: stream.BitRate,
          framerate: stream.AverageFrameRate,
        }
      };
    }
  }

  /**
   * Build a configuration for Audio
   * @param stream the stream
   * @returns new configuration
   */
  const getAudioConfiguration = (stream: BaseMediaStream): MediaDecodingConfiguration | undefined => {
    const audioCodec = getAudioCodec(stream)
    const container = getMediaContainer(stream)

    if (container) {
      return {
        type: "media-source",
        audio: {
          contentType: `audio/${container[0]};codecs="${audioCodec}"`,
          bitrate: stream.BitRate,
          channels: stream.ChannelLayout,
          samplerate: stream.SampleRate,
        }
      };
    }
  }

  /**
   * Test a media stream for compatibility
   * @param stream
   * @returns
   */
  const testMediaStream = async (stream: BaseMediaStream) => {
    let config;
    if (stream.Type === "Video") {
      config = getVideoConfiguration(stream)
    } else if (stream.Type === "Audio") {
      config = getAudioConfiguration(stream)
    }

    if (config) {
      // console.log('Config: ',stream.Type,config)
      const res = await navigator.mediaCapabilities.decodingInfo(config);
      return res
    }
  }

  /**
   * Test a video stream together with audio stream for compatibility. Does not work with avc1 + aac. Just the MDN examples with webm container?
   * @param video stream
   * @param audio stream
   * @returns
   */
  const testVideoAudioStream = async (video: BaseMediaStream, audio: BaseMediaStream) => {
    const videoCodec = getVideoCodec(video)
    const audioCodec = getAudioCodec(audio)
    const container = getMediaContainer(video)
    let config: MediaDecodingConfiguration | undefined = undefined;

    if (container) {
      config = {
        type: "media-source",
        video: { // avc1.XXXXX dot notation of video part breaks parsing
          contentType: `video/${container[0]};codecs="${videoCodec},mp4a.40.2"`, //
          width: video.Width,
          height: video.Height,
          bitrate: video.BitRate,
          framerate: video.AverageFrameRate,
        }
      };
    }

    if (config) {
      // console.log('Config: ',stream.Type,config)
      const res = await navigator.mediaCapabilities.decodingInfo(config);
      return res
    }
  }

  /**
   * transform browser string to jellyfin container string
   * @param cont container browser string
   * @returns
   */
  const toJellyfinContainer = (cont?: string) => {
    switch (cont) {
      case "mp4":
        return "mp4"
      case "mp2ts":
        return "ts"
      default:
        return undefined
    }
  }

  return { testMediaStream, getMediaContainer, toJellyfinContainer }
}
