import {useCallback} from 'react';
import {FC} from 'react';
import {Link, NavLink} from 'react-router-dom';
import {DB} from '../../data/bandsDB';
import {AppStatePropsNames} from '../../data/DataModels';
import Search from '../Search/Search';

interface HeaderProps {
  logoText?: string;
  showSearch?: boolean;
}

const Header: FC<HeaderProps> = ({showSearch, logoText}) => {
  const searchHandler = useCallback((searchText: string) => {
    DB.setAppStatePropVal(AppStatePropsNames.artistToPick, searchText);
  }, []);

  return (
    <div className="artist__navigation">
      <div className="logo">{logoText}</div>
      <Search onSearch={searchHandler} />
      <ul className="nav nav-tabs" role="tablist">
        <li role="presentation">
          <NavLink
            className={({isActive}) => (isActive ? 'active' : '')}
            to="/favorites-events"
            aria-controls="related-artists"
            role="tab"
            data-toggle="tab"
          >
            My favorites Events
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Header;
