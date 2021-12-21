import {useLiveQuery} from 'dexie-react-hooks';
import {FC, useCallback, useEffect, useState} from 'react';
import {DB} from '../../data/bandsDB';
import ArtistEvents from '../ArtistsEvents/ArtistsEvents';
import ArtistsList from '../ArtistsList/ArtistsList';
import {AppStatePropsNames, Artist, Event} from '../../data/DataModels';
import {MdLocationOn} from 'react-icons/md';
import {useMemo} from 'react';
import {isString} from 'lodash';
import {MOST_POPULAR} from '../../data/initData';

interface ownProps {
  title?: string;
  headerSide?: JSX.Element;
  subjectImage: string | JSX.Element;
  bgImageUrl: string;
  headerType: string;
  events?: Event[];
}

export const EventsPage: FC<ownProps> = ({
  title,
  subjectImage,
  bgImageUrl,
  headerType,
  headerSide,
  events,
}) => {
  const selectedArtist = useLiveQuery(async () => (await DB.getSelected())?.id + '' ?? '', [], '');

  const mostPop = useMemo(() => {
    const mostPopClone = [...MOST_POPULAR];
    const selectedIndex = mostPopClone.findIndex((artist: Artist) => artist.id === selectedArtist);
    mostPopClone.splice(selectedIndex, 1);
    const final = selectedIndex !== -1 ? mostPopClone : MOST_POPULAR;
    return final;
  }, [selectedArtist, MOST_POPULAR]);

  const cachedArtists = useLiveQuery(
    () =>
      DB.artists
        .where('id')
        .notEqual(selectedArtist)
        .reverse()
        .sortBy('timestamp', arr => arr?.slice(0, 9)),
    [selectedArtist],
    []
  );
  const eventsIsLoading = useLiveQuery(
    () => DB.getAppStatePropVal(AppStatePropsNames.eventsIsLoading),
    [selectedArtist],
    0
  );

  const image = useMemo(() => {
    return isString(subjectImage) ? <img src={subjectImage} /> : (subjectImage as JSX.Element);
  }, [subjectImage]);

  const onArtistSelectHandler = useCallback(id => {
    id && DB.setSelected(id);
  }, []);

  return (
    <>
      <div className="artist">
        <div className="artist__header">
          <div className="back-blured">
            <img src={bgImageUrl} />
          </div>
          <div className="artist__info">
            <div className="profile__img">{image}</div>
            <div className="artist__info__meta">
              <div className="artist__info__type">{headerType}</div>
              <div className="artist__info__name">{title}</div>
            </div>
          </div>
          <div className="artist__listeners">{headerSide}</div>
        </div>
        <div className="artist__content">
          <div className="tab-content">
            <div role="tabpanel" className="tab-pane active" id="artist-overview">
              <div className="overview">
                <div className="overview__artist">
                  <div className="section-title">
                    <span>Events</span>
                    {eventsIsLoading ? <div className="loader">LODING...</div> : null}
                  </div>
                  <div className="tracks">
                    {events?.length ? (
                      <ArtistEvents events={events} />
                    ) : !eventsIsLoading ? (
                      <div className="no-events-message">
                        <MdLocationOn size={'3em'} opacity={0.5} />
                        <span>No upcoming events</span>
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="overview__related">
                  <ArtistsList
                    title="Most Popular Artists"
                    onSelect={onArtistSelectHandler}
                    artists={mostPop}
                  />
                  <ArtistsList
                    title="Recently viewed"
                    onSelect={onArtistSelectHandler}
                    artists={cachedArtists}
                    style={{marginTop:"1em"}}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventsPage;

export const SideText: FC<{lineOne: string; lineTwo: string}> = ({lineOne, lineTwo}) => {
  return (
    <>
      <div className="artist__listeners__count">{lineOne}</div>
      <div className="artist__listeners__label">{lineTwo}</div>
    </>
  );
};
