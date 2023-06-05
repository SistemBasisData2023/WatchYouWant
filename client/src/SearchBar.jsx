import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm, searchMovies }) => {
  return (
    <div className="search">
      <input
        placeholder="Search your movie pick"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />

      <img
        src={SearchIcon}
        alt="search"
        onClick={() => searchMovies(searchTerm)}
      />
    </div>
  );
};

export default SearchBar;