import { useLiveQuery } from "dexie-react-hooks";
import { FC } from "react";
import EventsPage, { SideText } from "../components/EventsPage/EventsPage";
import { DB } from "../data/bandsDB";

export const ArtistPage: FC = () => {
  const selectedArtist = useLiveQuery(() => DB.getSelected(), []);
  const artistEvents = useLiveQuery(
    () => {
      return selectedArtist
        ? DB.events
            .where("artist_id")
            .equals(selectedArtist?.id)
            .sortBy("timestamp")
        : [];
    },
    [selectedArtist],
    []
  );

  if (!selectedArtist) return null;
  
  const { image_url, thumb_url, name, upcoming_event_count } = selectedArtist;

  return (
    <EventsPage
      events={artistEvents}
      title={name}
      subjectImage={thumb_url}
      bgImageUrl={image_url}
      headerType={"Artist"}
      headerSide={
        <SideText
          lineOne={upcoming_event_count + ""}
          lineTwo="Upcoming events"
        />
      }
    />
  );
};
