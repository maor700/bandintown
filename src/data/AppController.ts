import {useLiveQuery} from 'dexie-react-hooks';
import {FC, useEffect} from 'react';
import {useMatch, useNavigate} from 'react-router-dom';
import {RoutesPaths} from '../App';
import {DB} from './bandsDB';
import {AppStatePropsNames} from './DataModels';
import {MOST_POPULAR} from './initData';

export const pickArtistByName = async (name: string) => {
  const artist = await DB.getArtist(name, true);
  if (!artist) return;
  DB.setSelected(artist?.id);
};

export const AppController: FC = () => {
  const navigate = useNavigate();
  const params = useMatch(RoutesPaths['favorites-events']);
  const selectedId: string = useLiveQuery(async () => (await DB.getSelected())?.id ?? '', [DB], '');
  const artistToPick = useLiveQuery(
    async () => DB.getAppStatePropVal<string>('artistToPick'),
    [selectedId],
    ''
  );

  // init stuff
  useEffect(() => {
    DB.on('populate', async () => {
      await DB.artists.bulkAdd(MOST_POPULAR);
      //select ed sheeran
      DB.appState.bulkPut([
        {key: AppStatePropsNames.selectedArtist, value: '190899'},
        {key: AppStatePropsNames.artistToPick, value: 'Ed Sheeran'},
        {key: AppStatePropsNames.eventsIsLoading, value: 0},
      ]);
    });

    DB.on('ready', async () => {
      DB.appState.bulkPut([
        {key: AppStatePropsNames.artistToPick, value: ''},
        {key: AppStatePropsNames.eventsIsLoading, value: 0},
      ]);
    });
  }, []);

  useEffect(() => {
    if (selectedId) {
      DB.getArtistById(selectedId, true);
      navigate('/artist-events');
    }
  }, [selectedId]);

  useEffect(() => {
    const isFavoritesPage = location.pathname == '/' + RoutesPaths['favorites-events'];
    setTimeout(() => {
      isFavoritesPage && navigate(RoutesPaths['favorites-events']);
    },100);
  }, []);

  useEffect(() => {
    if (!artistToPick) return;
    (async () => {
      const artist = await DB.getArtist(artistToPick, true);
      if (!artist) return;
      DB.setSelected(artist?.id);
    })();
  }, [artistToPick, DB]);

  return null;
};
