import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import MovieCard from './MovieCard';
import Movie from './Movie.js';
import SearchInput from './SearchInput';
import { Avatar } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import Register from './Register';
import Login from './Login';
import User from './User';
import { FaUserCircle } from 'react-icons/fa';

const fetch = require('node-fetch');

const API_KEY = '386cfa223814f4c1798b997fc2e52a5a';

const App = () => {
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [japaneseMovies, setJapaneseMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [koreanMovies, setKoreanMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredFilm, setFeaturedFilm] = useState(null);

  const searchMovies = async (title) => {
    try {
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        title
      )}`;
      const response = await fetch(searchUrl);
      const data = await response.json();
      if (data.results) {
        setSearchResults(data.results);
        setTopRatedMovies([]);
        setJapaneseMovies([]);
        setHorrorMovies([]);
        setActionMovies([]);
        setKoreanMovies([]);
      } else {
        console.log('No Movies Found');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      setSearchResults([]);
    }
  };

  const fetchMovies = async () => {
    try {
      const topRatedUrl = `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`;
      const japaneseMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ja`;
      const horrorMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=27`;
      const actionMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`;
      const koreanMoviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_original_language=ko`;

      const responseTopRated = await fetch(topRatedUrl);
      const dataTopRated = await responseTopRated.json();
      const topRatedMovies = dataTopRated.results || [];
      setTopRatedMovies(topRatedMovies);

      const responseJapanese = await fetch(japaneseMoviesUrl);
      const dataJapanese = await responseJapanese.json();
      const japaneseMovies = dataJapanese.results || [];
      setJapaneseMovies(japaneseMovies);

      const responseHorror = await fetch(horrorMoviesUrl);
      const dataHorror = await responseHorror.json();
      const horrorMovies = dataHorror.results || [];
      setHorrorMovies(horrorMovies);

      const responseAction = await fetch(actionMoviesUrl);
      const dataAction = await responseAction.json();
      const actionMovies = dataAction.results || [];
      setActionMovies(actionMovies);

      const responseKorean = await fetch(koreanMoviesUrl);
      const dataKorean = await responseKorean.json();
      const koreanMovies = dataKorean.results || [];
      setKoreanMovies(koreanMovies);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setTopRatedMovies([]);
      setJapaneseMovies([]);
      setHorrorMovies([]);
      setActionMovies([]);
      setKoreanMovies([]);
    }
  };

  const fetchFeaturedFilm = async () => {
    try {
      const genreId = 878; // Replace with the desired genre ID (e.g., 878 for Science Fiction)
      fetchRandomMovie(genreId);
    } catch (error) {
      console.error('Error fetching featured film:', error);
    }
  };

  const fetchRandomMovie = async (genreId) => {
    try {
      const currentYear = new Date().getFullYear();
      const randomMovieUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&primary_release_date.gte=2000-01-01&primary_release_date.lte=${currentYear}-12-31&page=${Math.floor(Math.random() * 10) + 1}`;
      const response = await fetch(randomMovieUrl);
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        setFeaturedFilm(randomMovie);
      }
    } catch (error) {
      console.error('Error fetching random movie:', error);
    }
  };

  useEffect(() => {
    fetchFeaturedFilm();
    setSearchTerm('');
    fetchMovies();
  }, []);

  const handleHomeClick = () => {
    fetchMovies();
    fetchFeaturedFilm();
    setSearchResults([]);
    setSearchTerm(''); 
  };

  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isRegisterPage = location.pathname === '/register';

  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/user');
  };

  return (
    <div className="app">
      {!isLoginPage && !isRegisterPage && (
        <div className="top">
          <h1 className="home-title">
            <Link to="/app" className="home-link" onClick={handleHomeClick}>
              WatchYouWant
            </Link>
          </h1>
          <div className="search">
            <SearchInput onSearch={searchMovies} handleHomeClick={handleHomeClick} setSearchTerm={setSearchTerm} searchTerm={searchTerm}/>
          </div>
          <h1 className="home-welcome">Welcome Watcher!</h1>
          <div className="profile-icon" onClick={handleProfileClick}>
            <FaUserCircle size={70} />
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Login hideTopBar={true} />} />
        <Route path="/register" element={<Register hideTopBar={true} />} />
        <Route
          path="/app"
          element={
            <>
              {featuredFilm && (
                    <Link to={`/movie/${featuredFilm.id}`} style={{ textDecoration: 'none' }}>
                    <div className="movie-banner" style={{ backgroundImage: featuredFilm ? `url(https://image.tmdb.org/t/p/original/${featuredFilm.backdrop_path})` : '' }}>
                      <div className="movie-overlay"></div>
                      <div className="movie-details">
                        <h1 className="section-text">{featuredFilm.title}</h1>
                      </div>
                    </div>
                  </Link>
                )}

              {searchResults.length > 0 && (
                <div className="search-results-container">
                  <h2 className="section-text">Search Results</h2>
                  <div className="container">
                    {searchResults.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </div>
              )}

              {topRatedMovies.length > 0 && (
                <div className="search-results-container">
                  <h2 className="section-text">Top Rated Movies</h2>
                  <div className="container">
                    {topRatedMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </div>
              )}

              {horrorMovies.length > 0 && (
                <div className="search-results-container">
                  <h2 className="section-text">Horror Movies</h2>
                  <div className="container">
                    {horrorMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </div>
              )}

              {actionMovies.length > 0 && (
                <div className="search-results-container">
                  <h2 className="section-text">Action Movies</h2>
                  <div className="container">
                    {actionMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </div>
              )}

              {koreanMovies.length > 0 && (
                <div className="search-results-container">
                  <h2 className="section-text">Korean Movies</h2>
                  <div className="container">
                    {koreanMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </div>
              )}

              {japaneseMovies.length > 0 && (
                <div className="search-results-container">
                  <h2 className="section-text">Japanese Movies</h2>
                  <div className="container">
                    {japaneseMovies.map((movie) => (
                      <MovieCard movie={movie} key={movie.id} />
                    ))}
                  </div>
                </div>
              )}
            </>
          }
        />
        <Route path="/movie/:id" element={<Movie />} />
        <Route path="/user" element={<User email="example@example.com" />} />
      </Routes>
    </div>
  );
};

export default App;
