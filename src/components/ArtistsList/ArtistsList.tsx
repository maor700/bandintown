import {FC} from 'react';
import {Artist} from '../../data/DataModels';

interface OwnProps {
  title: string;
  artists: Artist[];
  onSelect: (id: string) => void;
  style?: React.CSSProperties
}

const ArtistsList: FC<OwnProps> = ({artists, onSelect, title, style}) => {
  return (
    <div style={style}>
      <div className="section-title">{title}</div>
      <div className="related-artists">
        {artists?.map(({name, thumb_url, id}, i) => (
          <div key={id} onClick={() => onSelect(id + '')} className="related-artist">
            <span className="related-artist__img">
              <img src={thumb_url} alt={name} />
            </span>

            <span className="related-artist__name">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsList;
