import {FC, useCallback, useState} from 'react';
import {MdSearch} from 'react-icons/md';

interface SearchProps {
  onSearch?: (searchText: string) => void;
}

const Search: FC<SearchProps> = ({onSearch}) => {
  const [searchText, setSearchText] = useState('');
  const searchHandler = useCallback(
    async ev => {
      ev?.preventDefault();
      onSearch?.(searchText);
    },
    [searchText]
  );

  return (
    <form onSubmit={searchHandler} className="search">
      <input
        name="search"
        id="search"
        type="text"
        onChange={({target}) => {
          setSearchText(target.value);
        }}
        value={searchText}
        placeholder="Search"
      />
      <label htmlFor="search">
        <button type="submit" className="search-btn" onClick={searchHandler}>
          <MdSearch />
        </button>
      </label>
    </form>
  );
};

export default Search;
