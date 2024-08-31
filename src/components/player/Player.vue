<template>
  <div v-if="showVideoPlayer" class="row justify-center">
    <div class="relative-position">
      <div class="relative-position" @click="playing = !playing" style="width:900px;height:506px">
        <video class="video-container fit" ref="mediaElementRef" :poster="posterUrl" crossorigin="anonymous" playsinline
          @loadeddata="onLoadedData">
        </video>
      </div>
      <div class="relative-position column q-mt-md">
        <div class="row items-center">
          <div class="q-mx-sm">
            {{ getTimefromSeconds(currentTime) }}
          </div>
          <PlayerScrubber v-model="currentTime" :max="duration" :secondary="endBuffer" class="col-grow">
            <template #default="{ position, pendingValue }">
              <div class="absolute bg-black rounded-borders q-px-sm q-mb-lg q-py-xs text-xs text-white"
                :style="{ left: position, top: '-50px' }">
                {{ getTimefromSeconds(pendingValue) }}
              </div>
            </template>
          </PlayerScrubber>
        </div>
        <div class="row items-center q-mt-sm">
          <q-btn outline round dense @click="playing = !playing">
            <q-icon>
              <i-mdi-play v-if="!playing" />
              <i-mdi-pause v-else />
            </q-icon>
          </q-btn>

          <q-btn class="q-ml-sm" outline round dense>
            <q-icon>
              <i-mdi-volume v-if="volume != 0" />
              <i-mdi-volume-mute v-else />
            </q-icon>
            <q-menu anchor="top left" self="bottom left">
              <div class="transparent q-my-md q-mx-sm">
                <q-slider @click.stop :min="0" :max="1" :step="0.1" vertical reverse v-model="volume">
                </q-slider>
              </div>
            </q-menu>
          </q-btn>

          <q-btn class="q-ml-md" outline round>
            {{ skipTime[currentSkipTimeIndex] }}s
            <q-menu auto-close anchor="top left" self="bottom left">
              <q-list>
                <q-item clickable @click="currentSkipTimeIndex = index" v-for="(item, index) in skipTime" :key="index"
                  :value="index">
                  <q-item-section>{{ item }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn class="q-ml-md" outline round dense>
            <q-icon><i-mdi-plus /></q-icon>
            <q-menu auto-close anchor="top left" self="bottom left">
              <q-list>
                <q-item clickable @click="$emit('createSegment', { start: numberToNumber(currentTime), type: item })"
                  v-for="(item, index) in Object.values(MediaSegmentType)" :key="index" :value="index">
                  <q-item-section>{{ item }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn class="q-ml-sm" outline round dense @click="pushTimestamp(true)">
            <q-icon>
              <i-mdi-ray-start-arrow />

            </q-icon>
          </q-btn>
          <q-btn class="q-ml-sm" outline round dense @click="pushTimestamp(false)">
            <q-icon>
              <i-mdi-ray-end-arrow />
            </q-icon>
          </q-btn>

          <q-btn class="q-ml-md" outline round dense>
            <q-icon><i-mdi-information /></q-icon>
            <q-menu anchor="top left" self="bottom left">
              <div class="q-pa-md">
                <span>Use
                  <KeyboardKeys :keyboardKeys="['enter']" /> to play/pause the player
                </span>
                <br>
                <span>Use
                  <KeyboardKeys :keyboardKeys="['a', 'd']" /> to change the timestamp
                </span>
                <br>
                <span>Use
                  <KeyboardKeys :keyboardKeys="['w', 's']" /> to change the skip timespan
                </span>
                <br>
                <span>Use
                  <KeyboardKeys :keyboardKeys="['e']" /> to copy current timestamp as start
                </span><br>
                <span>Use
                  <KeyboardKeys :keyboardKeys="['f']" /> to copy current timestamp as end
                </span><br>
                <span>You can switch the target segment slider by clicking on the segment type
                </span>
              </div>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="q-ml-auto">
      <q-btn v-if="showEdlBtn()" class="q-mx-sm" @click="writeEdl" round outline dense>
        edl
      </q-btn>
      <q-btn class="q-mx-sm" @click="copyFromSegmentClipboard" round outline dense>
        <q-icon>
          <i-mdi-content-paste />
        </q-icon>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVideoApi } from 'src/composables/videoApi';
import { useUtils } from 'src/composables/utils';
import { useAppStore } from 'stores/app';
import { ImageType, ItemDto, MediaSegmentType } from 'src/interfaces';
import Hls, { ErrorData } from 'hls.js';
import { nextTick, ref, watch, onBeforeUnmount, computed } from 'vue';
import { useMediaCapabilities } from 'src/composables/mediaCapabilities';
import { useMediaControls, computedAsync, whenever, useMagicKeys, useThrottleFn, onKeyStroke } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { usePluginEdlApi } from 'src/composables/pluginEdlApi'
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useSessionStore } from 'src/stores/session';
import { usePluginStore } from 'src/stores/plugin';


const { createEdlById } = usePluginEdlApi()
const { showEdlBtn } = usePluginStore()
const { getItemImageUrl, getTimefromSeconds, numberToNumber } = useUtils()
const { getVideoStream } = useVideoApi()
const { testMediaStream, getMediaContainer, toJellyfinContainer } = useMediaCapabilities()
const appStore = useAppStore()
const { getFromSegmentClipboard } = useSessionStore()
const { notify } = useQuasar()
const { t } = useI18n()
const { showVideoPlayer } = storeToRefs(appStore)

interface Props {
  item: ItemDto,
  timestamp?: number,
}

const emit = defineEmits(['createSegment', 'updateSegmentTimestamp'])
const props = defineProps<Props>()
const mediaElementRef = ref<HTMLMediaElement>();
const mediaControls = useMediaControls(mediaElementRef);
const videoUrl = ref<string>('');
const skipTime = ref([0.001, 0.01, 0.1, 1, 5])
const currentSkipTimeIndex = ref(4)

const {
  playing,
  buffered,
  currentTime,
  duration,
  tracks,
  waiting,
  selectedTrack,
  volume,
  muted,
  enableTrack,
  disableTrack,
} = mediaControls

const endBuffer = computed(() => buffered.value.length > 0 ? buffered.value[buffered.value.length - 1][1] : 0)

const throttledForwardFn = useThrottleFn(() => {
  currentTime.value += Math.min(skipTime.value[currentSkipTimeIndex.value], duration.value)
}, 100);

const throttledBackwardFn = useThrottleFn(() => {
  currentTime.value -= Math.max(skipTime.value[currentSkipTimeIndex.value], 0)
}, 100);

// just bind keys if player is active
if (showVideoPlayer) {
  const keys = useMagicKeys();

  whenever(keys.space, () => playing.value = !playing.value);
  whenever(keys.m, () => muted.value = !muted.value);
  whenever(keys.w, () => currentSkipTimeIndex.value = Math.min(currentSkipTimeIndex.value + 1, skipTime.value.length - 1));
  whenever(keys.s, () => currentSkipTimeIndex.value = Math.max(currentSkipTimeIndex.value - 1, 0));
  whenever(keys.e, () => pushTimestamp(true))
  whenever(keys.f, () => pushTimestamp(false))

  onKeyStroke(['j', 'a'], throttledBackwardFn);
  onKeyStroke(['l', 'd'], throttledForwardFn);
}

/**
 * Provide a new timestamp for all sliders
 * @param start start or end time
 */
const pushTimestamp = (start: boolean) => {
  emit('updateSegmentTimestamp', { currentTime, start })
}

/**
 * Get Video for item
 */
const getVideo = async () => {
  if (!showVideoPlayer.value)
    return;

  let forceVideoReason = undefined
  let forceAudioReason = undefined;
  let container = 'ts'

  // eval browser support
  if (navigator.mediaCapabilities) {
    console.log('titem:', props.item)
    // get streams
    const videos = props.item.MediaStreams.filter((s) => s.Type == 'Video')
    const audio = props.item.MediaStreams.filter((s) => s.Type == 'Audio')

    // test if first video stream is playable.
    if (videos.length) {
      const res = await testMediaStream(videos[0])
      if (res) {
        console.log('testVideo:', res)
        if (!res.supported) {
          forceVideoReason = videos[0].Codec
        } else {
          let c = toJellyfinContainer(getMediaContainer(videos[0])[0])
          if (c)
            container = c
        }
      } else {
        forceVideoReason = videos[0].Codec
      }
    }
    if (audio.length) {
      // test selected audio stream
      const res = await testMediaStream(audio[0])
      if (res) {
        console.log('testAudio:', res)
        if (!res.supported)
          forceAudioReason = audio[0].Codec
      } else {
        forceAudioReason = audio[0].Codec
      }
    }
  } else {
    // Not available for chromium < 66 (support for webos 5+ and Tizen 6 (not 5!))
    // not detected
    forceVideoReason = '-'
    forceAudioReason = '-'
  }
  videoUrl.value = getVideoStream(props.item.Id, forceVideoReason, forceAudioReason, container)
}


const posterUrl = computedAsync(
  async () => {
    return showVideoPlayer ? await getItemImageUrl(props.item, 900, 506, ImageType.Backdrop) : ''
  },
  '', // initial state
)

const hls = Hls.isSupported()
  ? new Hls({
    testBandwidth: false
  })
  : undefined;

/**
 * Detaches HLS instance after playback is done
 */
function detachHls(): void {
  if (hls) {
    hls.detachMedia();
    hls.off(Hls.Events.ERROR, onHlsEror);
  }
}

/**
 * Called by the media element when the playback is ready
 */
async function onLoadedData(): Promise<void> {
  /*
  if (playbackManager.currentlyPlayingMediaType === 'Video') {
    if (mediaElementRef.value) {
      mediaElementRef.value.currentTime = playbackManager.currentTime;
    }

  }
  */
  console.log('Player loaded data!')
}

/**
 * Callback for when HLS.js gets an error
 */
function onHlsEror(_event: typeof Hls.Events.ERROR, data: ErrorData): void {
  if (data.fatal && hls) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR: {
        // try to recover network error
        // useSnackbar(t('errors.playback.networkError'), 'error');
        console.error('fatal network error encountered, try to recover');
        hls.startLoad();
        break;
      }
      case Hls.ErrorTypes.MEDIA_ERROR: {
        // useSnackbar(t('errors.playback.mediaError'), 'error');
        console.error('fatal media error encountered, try to recover');
        hls.recoverMediaError();
        break;
      }
      default: {
        /**
         * Can't recover from unknown errors
         */
        // useSnackbar(t('errors.cantPlayItem'), 'error');
        // playbackManager.stop();
        console.log('hls player error', data)
        break;
      }
    }
  }
}

const writeEdl = () => {
  createEdlById([props.item.Id])
  notify({ message: t('plugin.edl.created') })
}

const copyFromSegmentClipboard = () => {
  let seg = getFromSegmentClipboard()
  if (seg) {
    // update itemID and id
    seg.ItemId = props.item.Id
    emit('createSegment', { start: seg.StartTicks, end: seg.EndTicks, type: seg.Type })
  } else {
    notify({ message: t('editor.noSegmentInClipboard'), type: 'negative' })
  }
}

watch(mediaElementRef, async () => {
  await nextTick();
  detachHls();

  if (mediaElementRef.value && hls) {
    hls.attachMedia(mediaElementRef.value);
    hls.on(Hls.Events.ERROR, onHlsEror);
  }
});

watch(
  () => videoUrl.value,
  () => {
    if (hls) {
      hls.stopLoad();
    }

    if (!videoUrl.value) {
      return;
    }

    if (
      mediaElementRef.value &&
      (/*playbackManager.currentMediaSource?.SupportsDirectPlay ||*/ !hls)
    ) {
      /**
       * For the video case, Safari iOS doesn't support hls.js but supports native HLS
       */
      mediaElementRef.value.src = videoUrl.value;
    } else if (hls) {
      hls.loadSource(videoUrl.value);
    }
  }
);

// set time whenever a segment requests a change
watch(
  () => props.timestamp,
  () => {
    if (props.timestamp != undefined && showVideoPlayer.value) {
      currentTime.value = props.timestamp ?? 0;
    }
  }
);

onBeforeUnmount(() => detachHls())

await getVideo()
</script>

<style>
.video-container:focus {
  outline: none;
}
</style>
