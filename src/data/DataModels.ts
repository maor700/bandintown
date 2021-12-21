export class AppState {
  key!: string;
  value!: any;
}

export enum AppStatePropsNames {
  selectedArtist = 'selectedArtist',
  artistToPick = 'artistToPick',
  eventsIsLoading = 'eventsIsLoading',
}

export class Artist {
  id!: string;
  name!: string;
  url!: string;
  image_url!: string;
  thumb_url!: string;
  facebook_page_url!: string;
  mbid!: string;
  tracker_count!: number;
  upcoming_event_count!: number;
  timestamp?: Date;
}

export class Event {
  artistName?: string;
  id!: string;
  artist_id!: string;
  url!: string;
  on_sale_datetime!: string;
  datetime!: string;
  description!: string;
  venue!: Venue;
  offers!: Offer[];
  lineup!: string[];
  artist?: Artist;
}

export interface Offer {
  type: string;
  url: string;
  status: string;
}

export interface Venue {
  name: string;
  latitude: string;
  longitude: string;
  city: string;
  region: string;
  country: string;
}

export class Favorit {
  id!: string;
}
