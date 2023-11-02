export enum MediaSegmentType {
  INTRO = 'Intro',
  OUTRO = 'Outro',
  PREVIEW = 'Preview',
  RECAP = 'Recap',
  COMMERCIAL = 'Commercial'
}

export enum MediaSegmentAction {
  AUTO = 'Auto',
  NONE = 'None',
  SKIP = 'Skip',
  PROMPT = 'Prompt',
  MUTE = 'Mute'
}

export class MediaSegment {
  Start = 0;
  End = 1;
  Type: MediaSegmentType = MediaSegmentType.INTRO;
  TypeIndex = 0;
  ItemId = 'notlegit';
  Action: MediaSegmentAction = MediaSegmentAction.AUTO;
}

export enum ItemType {
  Movie = 'Movie',
  Series = 'Series',
  Season = 'Season',
  Episode = 'Episode',
  MusicArtist = 'MusicArtist',
  MusicAlbum = 'MusicAlbum',
}

export interface UserData {
  UnplayedItemCount: number,
  PlaybackPositionTicks: number,
  PlayCount: number,
  IsFavorite: boolean,
  Played: boolean,
  Key: number
}

export interface BaseMediaStream {
  Codec: string, // dts, h264, hevc or vp8
  CodecTag?: string // hev1, hvc1, av01
  Language: string, // eng or ger
  TimeBase: string, // 1/1000
  DisplayTitle: string, // 1080p H264 SDR or  Ger - DTS - 5.1 - Default
  IsInterlaced: boolean, // false
  IsAVC: boolean, // false
  BitRate: number, // 1536000
  IsDefault: boolean, // true
  IsForced: boolean, // false
  IsHearingImpaired: boolean, // false
  Profile: string, // High for movie codec or DTS for audio
  Type: string, // Video or Audio or Data
  Index: number, // 0 (array index position in MediaStreams)
  IsExternal: boolean, // false
  IsTextSubtitleStream: boolean, // false
  SupportsExternalStream: boolean, // false
  Level: number // For video: 41 or 0 for audio
  // audio
  ChannelLayout: string, // 5.1
  Channels: number, // 6
  SampleRate: number, // 48000
  // video
  VideoRange: string, // SDR
  VideoRangeType: string, //SDR
  ColorPrimaries?: string,
  ColorSpace?: string, // h264 -> "bt709"
  ColorTransfer?: string, // h264 -> "bt709"
  NalLengthSize: number, // 4
  BitDepth: number, // 8
  RefFrames: number, // 1
  Height: number, // 1080
  Width: number, // 1920
  AverageFrameRate: number, // 25
  RealFrameRate: number, // 25
  AspectRatio: string, // 16:9
  PixelFormat: string, // yuv420p
}

export interface ImageBlurHashesDto {
  Backdrop: {
    id: string
  }
  Primary: {
    id: string
  }
  Logo: {
    id: string
  }
}

export interface ItemDto {
  Name: string, // Episode 1, Season 1, Movie name
  serverId: string,
  Id: string,
  PremiereDate: Date,
  OfficialRating: string,
  ChannelId: null | string,
  CommunityRating: number,
  RunTimeTicks: number,
  ProductionYear: number,
  MediaStreams: BaseMediaStream[],
  Container: string, // matroska,webm
  IsFolder: boolean,
  Type: ItemType,
  UserData: UserData,
  Status: string,
  ImageBlurHashes: ImageBlurHashesDto,
  LocationType: string, // Filesystem
  // Season Dto
  IndexNumber?: number,
  ParentLogoItemId?: string,
  ParentBackdropItemId?: string,
  ParentBackdropImageTags?: [
    string
  ],
  SeriesName?: string,
  SeriesId?: string,
  SeriesPrimaryImageTag?: string,
  ImageTags?: {
    Primary?: string
  },
  BackdropImageTags?: [string],
  ParentLogoImageTag?: string
  // EpisodeDto
  ParentIndexNumber?: number,
  SeasonId?: string,
  SeasonName?: string, // Staffel 1
  VideoType?: string, // VideoFile
  MediaType?: string // Video
  // MusicAlbum
  AlbumArtist?: string,
  AlbumArtists?: object[],
  ArtistItems?: object[]

}

export interface VirtualFolderDto {
  Name: string, // Name of folder
  Locations: [
    string
  ],
  CollectionType: string, // movies, tvshows
  LibraryOptions: {
    EnablePhotos: boolean,
    EnableRealtimeMonitor: boolean,
    EnableChapterImageExtraction: boolean,
    ExtractChapterImagesDuringLibraryScan: boolean,
    PathInfos: [
      {
        Path: string
      }
    ],
    SaveLocalMetadata: boolean,
    EnableInternetProviders: boolean,
    EnableAutomaticSeriesGrouping: boolean,
    EnableEmbeddedTitles: boolean,
    EnableEmbeddedExtrasTitles: boolean,
    EnableEmbeddedEpisodeInfos: boolean,
    AutomaticRefreshIntervalDays: number,
    PreferredMetadataLanguage: string, // de
    MetadataCountryCode: string, // DE
    SeasonZeroDisplayName: string, // Specials
    MetadataSavers: [string],
    DisabledLocalMetadataReaders: [string],
    LocalMetadataReaderOrder: [ // nfo
      string
    ],
    DisabledSubtitleFetchers: [string],
    SubtitleFetcherOrder: [string],
    SkipSubtitlesIfEmbeddedSubtitlesPresent: boolean,
    SkipSubtitlesIfAudioTrackMatches: boolean,
    SubtitleDownloadLanguages: [string],
    RequirePerfectSubtitleMatch: boolean,
    SaveSubtitlesWithMedia: boolean,
    AutomaticallyAddToCollection: boolean,
    AllowEmbeddedSubtitles: string, // AllowAll
    TypeOptions: [
      {
        Type: string, // Movies, Episode, Season, Series
        MetadataFetchers: [ // TheMovieDb, The Open Movie Database
          string
        ],
        MetadataFetcherOrder: [
          string
        ],
        ImageFetchers: [
          string
        ],
        ImageFetcherOrder: [
          string
        ],
        ImageOptions: []
      }
    ]
  },
  ItemId: string, // the itemID
  PrimaryImageItemId: string,
  RefreshStatus: string // Idle
}

/**
 * Enum ImageType.
 * @export
 * @enum {string}
 */
export enum ImageType {
  Primary = 'Primary',
  Art = 'Art',
  Backdrop = 'Backdrop',
  Banner = 'Banner',
  Logo = 'Logo',
  Thumb = 'Thumb',
  Disc = 'Disc',
  Box = 'Box',
  Screenshot = 'Screenshot',
  Menu = 'Menu',
  Chapter = 'Chapter',
  BoxRear = 'BoxRear',
  Profile = 'Profile',
}
