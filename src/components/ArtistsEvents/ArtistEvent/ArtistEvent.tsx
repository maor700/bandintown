import {FC, useState} from 'react';
import {Event} from '../../../data/DataModels';
import Modal from 'react-modal';
import {useLiveQuery} from 'dexie-react-hooks';
import {DB} from '../../../data/bandsDB';
import {MdOutlineFavoriteBorder, MdFavorite, MdClose} from 'react-icons/md';
import dayjs from 'dayjs';
import './ArtistEvent.scss';
dayjs().format();

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    maxWidth: '600px',
    height: '80%',
    color: '#aaa',
    border: '1px solid #222',
    background:
      'linear-gradient(353deg, rgb(5 3 38 / 30%) 30%, rgb(64 9 42 / 30%) 65%, rgb(19 120 141 / 40%) 100%)',
  },
  overlay: {backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 2},
};

interface ArtistEventProps {
  data: Event;
  num: number;
  showArtistImage?: boolean;
}

const ArtistEvent: FC<ArtistEventProps> = ({data, num, showArtistImage}) => {
  const [modalIsOpen, setIsOpen] = useState(false);
  // const image = false;

  const isFavorite = useLiveQuery(
    async () => !!(await DB.favorites.get(data?.id)),
    [data?.id],
    false
  );

  if (!(data instanceof Event)) return null;

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const {datetime, venue, description, offers, id} = data;
  const {city, country, name} = venue;

  return (
    <div key={id} className="artist-event">
      <div className="track" onClick={openModal}>
        {/* {image && (
          <div className="track__art">
            <img src={image} />
          </div>
        )} */}
        <div className="track__number">{num}</div>

        <div
          onClick={async ev => {
            ev.stopPropagation();
            DB.toggleFavorite(id);
          }}
          className="track__added favorit-icon"
        >
          {isFavorite ? <MdFavorite color="gold" /> : <MdOutlineFavoriteBorder />}
        </div>

        <div className="track__title">
          {country}
          <span style={{opacity: '0.5', margin: '0 1em'}}>{city}</span>
        </div>
        <div className="track__plays">{dayjs(datetime).format('DD.MM.YY')}</div>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="artist-details-modal grid-header-footer-con">
          <h2 className="haeder">Event Details</h2>
          <div className="main modal-content">
            <div className="event-field">
              <div className="label">Date:</div> {new Date(datetime).toDateString()}
            </div>
            {description && (
              <div className="event-field">
                <div className="label">Description:</div> {description}
              </div>
            )}
            <div className="event-field">
              <div className="label">Venue Information:</div>
              <span>{`${name}, ${city},${country}`}</span>
            </div>
            <div className="event-field">
              <div className="label">Special Offers:</div>
              {offers?.map(({type, url, status}) => {
                return (
                  <div key={type + url} className="offer">
                    <a href={url} target={'_blank'} className="offer-type">
                      {type}
                    </a>
                    {/* <div className="offer-status">{status}</div> */}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="actions footer">
            <div onClick={() => DB.toggleFavorite(data?.id, !isFavorite)} className="favorit">
              {isFavorite ? (
                <MdFavorite title="Remove from favorites" color="gold" />
              ) : (
                <MdOutlineFavoriteBorder title="Add to favorites" />
              )}
            </div>
            <MdClose title="Close" onClick={closeModal} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArtistEvent;
