import Dexie, {Table} from 'dexie';
import {AppState, AppStatePropsNames, Artist, Event, Favorit} from './DataModels';
import {MOST_POPULAR} from './initData';

const API_URL = `https://rest.bandsintown.com/`;
const API_URL_ARTIST = `${API_URL}artists/`;
const APP_ID = '123';
const DEAFUTL_PARAMS = [['app_id', APP_ID]];

class BrandsDB extends Dexie {
  appState!: Table<AppState>;
  artists!: Table<Artist>;
  events!: Table<Event>;
  favorites!: Table<Favorit>;

  constructor() {
    super('BrandsDB');
    this.version(1).stores({
      artists: '&id, name, upcoming_event_count',
      events: '&id, artist_id, datetime, artistName',
      favorites: '&id',
      appState: '&key',
    });

    this.artists.mapToClass(Artist);
    this.events.mapToClass(Event);
    this.favorites.mapToClass(Favorit);
  }

  //artist

  async getArtistFromApi(artistName: string): Promise<Artist | undefined> {
    return fetch(`${API_URL_ARTIST}${artistName}${this._createParams()}`).then(res => res.json());
  }

  async getArtistFromStorage(artistName: string) {
    return this.artists.where('name').equalsIgnoreCase(artistName).first();
  }

  async getArtist(artistName: string, withEvents?: boolean) {
    if (!artistName) return;

    const storage = new Promise<{source: 'api' | 'storage'; data: Artist}>(async resolve => {
      const data = await this.getArtistFromStorage(artistName);

      if (data) {
        resolve({source: 'storage', data});
      }
    });

    const api = new Promise<{source: 'api' | 'storage'; data: Artist}>(async resolve => {
      const data = await this.getArtistFromApi(artistName);

      if (data && !(data as any)?.error) {
        resolve({source: 'api', data});
      }
    });

    try {
      await this.setAppStatePropVal(AppStatePropsNames.eventsIsLoading, 1);
      const results = await Promise.race([storage, api, timeoutPromise(5000)]);
      if (!results) return undefined;
      const {source, data: artist} = results;

      if (source === 'api') {
        this.artists.put({...artist, timestamp: new Date()});
      }

      let events: Event[] = [];
      if (withEvents) {
        events = (await this.getEvents(artistName)) ?? [];
      }
      return {...artist, events};
    } catch (error) {
      return undefined;
    }finally{
      await this.setAppStatePropVal(AppStatePropsNames.eventsIsLoading, 0);
    }
  }

  async getArtistById(artistId: string, withEvents?: boolean) {
    if (!artistId) return;
    const artist = await this.artists.get(artistId);
    if (!artist) return;
    const {name} = artist;
    return this.getArtist(name, withEvents);
  }
  // events

  async getEventsFromApi(artistName: string): Promise<Event[] | undefined> {
    return fetch(`${API_URL_ARTIST}${artistName}/events/${this._createParams()}`).then(res =>
      res.json()
    );
  }

  async getEventsFromStorage(artistName: string): Promise<Event[] | undefined> {
    const artistNameAdaptations = artistName?.replaceAll(/\s+/g, '');

    return this.events.where('artistName').equalsIgnoreCase(artistNameAdaptations).toArray() as any;
  }

  async getEvents(artistName: string) {
    if (!artistName) return;
    const storage = new Promise<{source: 'api' | 'storage'; data: Event[]}>(async resolve => {
      const data = await this.getEventsFromStorage(artistName);

      if (data?.length) {
        resolve({source: 'storage', data});
      }
    });

    const api = new Promise<{source: 'api' | 'storage'; data: Event[]}>(async resolve => {
      const data = await this.getEventsFromApi(artistName);

      if (data && !(data as any)?.error) {
        resolve({source: 'api', data});
      }
    });

    const results = await Promise.race([storage, api, timeoutPromise(5000)]);
    if (!results) return undefined;
    const {source, data: events} = results;
    if (source === 'api') {
    }
    this.transaction('rw', this.events, this.artists, () => {
      const newEvents = events.map(_ => ({..._, artistName}));
      this.events.bulkPut(newEvents);
    });

    return events;
  }

  // favorites
  async toggleFavorite(id: string, force?: boolean) {
    if (force) {
      const fovoritToAdd: Favorit = {id};
      return this.favorites.put(fovoritToAdd);
    }

    const deleted = await this.favorites.where('id').equals(id).delete();
    !deleted && this.favorites.add({id});
  }

  async setSelected(id: string): Promise<boolean> {
    return this.setAppStatePropVal(AppStatePropsNames.selectedArtist, id);
  }

  async getSelected(): Promise<Artist | undefined> {
    const selectedId = await this.getAppStatePropVal(AppStatePropsNames.selectedArtist);
    return await this.artists.get(selectedId);
  }

  async clearSelection() {
    return this.setAppStatePropVal(AppStatePropsNames.selectedArtist, '');
  }

  // appState table utils

  getAppPropCollection = (propName: string) => {
    return this.appState.where('key').equals(propName);
  };

  getAppStatePropVal = async <T = any>(propName: string) => {
    return (await this.getAppPropCollection(propName).first())?.value;
  };

  setAppStatePropVal = async <T = any>(propName: string, value: T) => {
    const propExist = !!(await this.getAppPropCollection(propName).first());
    if (propExist) {
      return !!(await this.getAppPropCollection(propName).modify({value}));
    } else {
      return !!(await this.appState.add({key: propName, value}));
    }
  };

  private _createParams = (params: [][] = []) => {
    return '?' + new URLSearchParams([...DEAFUTL_PARAMS, ...params]).toString();
  };
}

export const DB = new BrandsDB();

const timeoutPromise = async (duration: number): Promise<void> => {
  return new Promise(reject => {
    setTimeout(reject, duration);
  });
};
