import {FC} from 'react';
import {Event} from '../../data/DataModels';
import ArtistEvent from './ArtistEvent/ArtistEvent';

interface ArtistEventsProps {
  events: Event[];
}

export const ArtistEvents: FC<ArtistEventsProps> = ({events}) => {
  return (
    <div className="events-list">
      {events?.map((event, i) => (
        <ArtistEvent key={event?.id} num={i + 1} data={event} />
      ))}
    </div>
  );
};

export default ArtistEvents;
