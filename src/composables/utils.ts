import { ImageType, ItemDto, MediaSegment } from 'src/interfaces';
import { useApi } from 'src/composables/api'

export function useUtils() {
  const { getImage } = useApi()

  /**
   * Get image url from item
   * @param item item
   * @param imgType image type
   */
  async function getItemImageUrl(item: ItemDto, width: number, height: number, imgType: ImageType) {
    let imgTag;
    let itemId: string = item.Id;

    const preferBackdrop = imgType == ImageType.Backdrop

    if (
      preferBackdrop &&
      item.BackdropImageTags &&
      item.BackdropImageTags.length > 0
    ) {
      imgType = ImageType.Backdrop;
      imgTag = item.BackdropImageTags[0];
    } else if (
      preferBackdrop &&
      item.ParentBackdropImageTags?.[0] &&
      item.ParentBackdropItemId
    ) {
      imgType = ImageType.Backdrop;
      imgTag = item.ParentBackdropImageTags[0];
      itemId = item.ParentBackdropItemId;
    } /* else if (
    item.ImageTags &&
    item.ImageTags.Primary &&
    (item.Type !== BaseItemKind.Episode || item.ChildCount !== 0)
  ) {
    imgType = ImageType.Primary;
    imgTag = item.ImageTags.Primary;
    height =
      width && item.PrimaryImageAspectRatio
        ? Math.round(width / item.PrimaryImageAspectRatio)
        : undefined;
  } else if (item.SeriesPrimaryImageTag) {
    imgType = ImageType.Primary;
    imgTag = item.SeriesPrimaryImageTag;
    itemId = item.SeriesId;
  } else if (item.ParentPrimaryImageTag) {
    imgType = ImageType.Primary;
    imgTag = item.ParentPrimaryImageTag;
    itemId = item.ParentPrimaryImageItemId;
  } else if (item.AlbumId && item.AlbumPrimaryImageTag) {
    imgType = ImageType.Primary;
    imgTag = item.AlbumPrimaryImageTag;
    itemId = item.AlbumId;
    height =
      width && item.PrimaryImageAspectRatio
        ? Math.round(width / item.PrimaryImageAspectRatio)
        : undefined;
  }*/

    const res = await getImage(itemId, width, height, imgType)
    const url = await getImageOfStream(res)
    return url
  }

  // Get image of a Request body stream
  async function getImageOfStream(response: Response) {
    const reader = response?.body?.getReader();
    const readableStream = new ReadableStream({
      start(controller) {
        return pump();
        function pump() {
          return reader?.read().then(({ done, value }) => {
            // When no more data needs to be consumed, close the stream
            if (done) {
              controller.close();
              return;
            }
            // Enqueue the next data chunk into our target stream
            controller.enqueue(value);
            return pump();
          });
        }
      },
    });

    // Create a new response out of the stream
    const newres = new Response(readableStream)
    // Create an object URL for the response
    const blob = await newres.blob()
    return URL.createObjectURL(blob)
  }

  function getColorByType(type: MediaSegment['Type']) {
    switch (type) {
      case 'Intro':
        return 'green-5'
      case 'Outro':
        return 'purple-4'
      case 'Preview':
        return 'light-green'
      case 'Recap':
        return 'lime'
      case 'Commercial':
        return 'red'
      default:
        return 'white'
    }
  }

  /**
   * Converts .NET ticks to milliseconds
   *
   * @param ticks - Number of .NET ticks to convert
   * @returns The converted value in milliseconds
   */
  function ticksToMs(ticks: number | null | undefined): number {
    if (!ticks) {
      ticks = 0;
    }

    return Math.round(ticks / 10_000);
  }

  /**
* Converts seconds to Ticks
*
* @param ticks - Number of .NET ticks to convert
* @returns The converted value in ticks
*/
  function secondsToTicks(seconds: number | null | undefined): number {
    if (!seconds) {
      seconds = 0;
    }

    return Math.round(seconds * 10_000_000);
  }

  /**
   * Parse a number string to 3 digits float
   * @param numb number to parse
   * @returns
   */
  function stringToNumber(numb: string) {
    return Math.round((Number.parseFloat(numb) + Number.EPSILON) * 1000) / 1000
  }

  /**
   * Parse a number to 3 digits float
   * @param numb number to parse
   * @returns
   */
  function numberToNumber(numb: number) {
    return Math.round((numb + Number.EPSILON) * 1000) / 1000
  }


  /**
   * Array.sort() function to sort by Segment.Start
   * @param sA segmnt a
   * @param sB segment b
   * @returns
   */
  function sortSegmentsStart(sA: MediaSegment, sB: MediaSegment) {
    if (sA.StartTicks < sB.StartTicks) {
      return -1;
    }
    if (sA.StartTicks > sB.StartTicks) {
      return 1;
    }
    // or equal
    return 0;
  }

  /**
   * Convert seconds into a time string like so '1h 10m 20s'
   * @param timeInsSeconds The seconds to convert
   * @returns time tring
   */
  function getReadableTimeFromSeconds(timeInsSeconds: number) {
    const minsTemp = timeInsSeconds / 60;
    let hours = Math.floor(minsTemp / 60);
    const mins = Math.floor(minsTemp % 60);
    const secs = Math.floor(timeInsSeconds % 60);
    if (hours !== 0 && mins !== 0) {
      if (mins > 59) {
        hours += 1;
        return +`${hours}h ${secs}s`;
      } else {
        return `${hours}h ${mins.toFixed(0)}m ${secs}s`;
      }
    } else if (hours === 0 && mins === 0) {
      return `${secs}s`;
    } else if (hours === 0 && mins !== 0) {
      return `${mins.toFixed(0)}m ${secs}s`;
    } else if (hours !== 0 && mins === 0) {
      return `${hours}h ${secs}s`;
    }
  }

  /**
 * Convert seconds into a time string like so '1:10:20'
 * @param timeInsSeconds The seconds to convert
 * @returns time tring
 */
  function getTimefromSeconds(timeInsSeconds: number) {

    const minsTemp = timeInsSeconds / 60;
    let hours = Math.floor(minsTemp / 60);

    const minTemp1 = Math.floor(minsTemp % 60)
    const mins = minTemp1 < 10 ? `0${minTemp1}` : `${minTemp1}`;

    const secsTemp1 = Math.floor(timeInsSeconds % 60);
    const secs = secsTemp1 < 10 ? `0${secsTemp1}` : `${secsTemp1}`

    const ms = (timeInsSeconds % 1).toFixed(3).substring(2);

    if (hours !== 0 && minTemp1 !== 0) {
      if (minTemp1 > 59) {
        hours += 1;
        return +`${hours}:${mins}:${secs}:${ms}`;
      } else {
        return `${hours}:${mins}:${secs}:${ms}`;
      }
    } else if (hours === 0) {
      return `${mins}:${secs}:${ms}`;
    } else if (hours !== 0) {
      return `${hours}:${mins}:${secs}:${ms}`;
    }

  }

  /**
   * Convert a time string to seconds. 1:20:15 or 1 20 15
   * @param time time string to parse
   * @returns time in seconds
   */
  function getSecondsFromTime(time: string | number | undefined) {
    if (time == undefined)
      return 0
    const ntime = typeof time === 'string' ? time.trim() : String(time);

    let splitted = new Array<string>();
    // prepare format
    if ([':', ' '].filter((el) => ntime.includes(el)))
      splitted = ntime.split(':')
    if (splitted.length == 1)
      splitted = ntime.split(' ')
    // last segment is seconds
    const sec = splitted.pop()?.trim()
    const min = splitted.pop()?.trim()
    const h = splitted.pop()?.trim()

    let totalSecs = 0

    if (sec != undefined)
      totalSecs += Number.parseFloat(sec)
    if (min != undefined)
      totalSecs += Number.parseFloat(min) * 60
    if (h != undefined)
      totalSecs += Number.parseFloat(h) * 60 * 60

    return totalSecs
  }


  /**
   * Create uuid
   * @returns uuid
   */
  function generateUUID() {
    let d = new Date().getTime();
    let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = Math.random() * 16;
      if (d > 0) {
        r = (d + r) % 16 | 0;
        d = Math.floor(d / 16);
      } else {
        r = (d2 + r) % 16 | 0;
        d2 = Math.floor(d2 / 16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  return { getImageOfStream, getColorByType, getReadableTimeFromSeconds, getTimefromSeconds, getSecondsFromTime, ticksToMs, secondsToTicks, stringToNumber, numberToNumber, sortSegmentsStart, getItemImageUrl, generateUUID }
}
