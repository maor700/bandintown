import {useLiveQuery} from 'dexie-react-hooks';
import {FC} from 'react';
import EventsPage, {SideText} from '../components/EventsPage/EventsPage';
import {DB} from '../data/bandsDB';
import {Event} from '../data/DataModels';
import favoritesIcon from '../assets/favorite-icon.png';
import bgImage from '../assets/bokeh.jpg';
import {MdFavorite} from 'react-icons/md';

const FAVORIT_PAGE_DETAILS = {
  title: 'Favorites',
  thumImageUrl: favoritesIcon,
  imageUrl: bgImage,
  headerType: 'favorites',
  headerSide: '',
};

export const FavoritesPage: FC = () => {
  
  const favoritesEvents = useLiveQuery(
    async () => {
      const ids = await DB.favorites.toCollection().keys();
      const result: Event[] = (await DB.events.bulkGet(ids)) as any;
      return result;
    },
    [],
    []
  );

  if (!favoritesEvents) return null;

  const {imageUrl, thumImageUrl, title, headerType} = FAVORIT_PAGE_DETAILS;

  return (
    <EventsPage
      events={favoritesEvents}
      title={title}
      subjectImage={<MdFavorite size={'6em'} color="#eee" />}
      bgImageUrl={imageUrl}
      headerType={headerType}
      headerSide={<SideText lineOne={favoritesEvents?.length + ''} lineTwo="Favorites Events" />}
    />
  );
};
