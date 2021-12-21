import {BrowserRouter, Navigate, Route, Routes, useNavigate} from 'react-router-dom';
import Header from './components/Header/Header';
import {ArtistPage} from './pages/ArtistPage';
import {FavoritesPage} from './pages/FavoritesPage';
import 'bootstrap/dist/css/bootstrap.css';
import './styles.scss';
import {useLiveQuery} from 'dexie-react-hooks';
import {DB} from './data/bandsDB';
import {useEffect} from 'react';
import {FC} from 'react';
import {AppStatePropsNames} from './data/DataModels';
import {AppController} from './data/AppController';

export enum RoutesPaths {
  'artist-events' = 'artist-events',
  'favorites-events' = 'favorites-events'
}
export const ROUTES:{[K in RoutesPaths]:JSX.Element} = {
  'artist-events': <ArtistPage />,
  'favorites-events': <FavoritesPage />,
};

export default function App() {
  return (
    <BrowserRouter>
      <AppController />
      <div className="app">
        <div className="app-con">
          <Header showSearch logoText="Who’s In Town" />
        </div>
        <div className="content__middle">
          <Routes>
            {Object.entries(ROUTES).map(([path, element]) => {
              return <Route key={path} path={path} element={element} />;
            })}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const NavigationsRules: FC = () => {
  const selectedId: string = useLiveQuery(
    () => DB.getAppStatePropVal(AppStatePropsNames.selectedArtist),
    [],
    ''
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedId) {
      navigate('/artist-events');
    }
  }, [selectedId]);
  return null;
};
