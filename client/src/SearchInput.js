import React, { useState, useEffect } from 'react';
import './SearchInput.css';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchInput = ({ onSearch, searchTerm, setSearchTerm }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      onSearch(searchTerm);
      navigate('/app');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  useEffect(() => {
    setSearchTerm('');
  }, [location.pathname]);

  return (
    <div className="container-input">
      <input
        type="text"
        placeholder="Search"
        name="text"
        className="input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <svg
        fill="#000000"
        width="20px"
        height="20px"
        viewBox="0 0 1920 1920"
        xmlns="http://www.w3.org/2000/svg"
        onClick={handleSearch}
      >
        <path d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z" fillRule="evenodd"></path>
      </svg>
    </div>
  );
};

export default SearchInput;
