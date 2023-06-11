import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './User.css';
import MovieCard from './MovieCard';
import { FaRegUserCircle } from 'react-icons/fa';
import { groupBy } from 'lodash';

const User = ({ user, username, email }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const defUsername = username || 'User';
  const defemail = email || 'No Email Found';
  const [favoriteMoviesCount, setFavoriteMoviesCount] = useState(0);
  const [favoriteGenre, setFavoriteGenre] = useState('');

  useEffect(() => {
    console.log(user.user_id);
    fetchFavoriteMovies();
  }, []);

  useEffect(() => {
    setFavoriteGenre(getFavoriteGenre());
  }, [favoriteMovies]);

  const fetchFavoriteMovies = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getfav/${user.user_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      const movies = await response.json();
      console.log(movies);
  
      if (Array.isArray(movies)) {
        setFavoriteMovies(movies);
        setFavoriteMoviesCount(movies.length);
      } else {
        setFavoriteMovies([]);
        setFavoriteMoviesCount(0);
      }
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      setFavoriteMovies([]);
      setFavoriteMoviesCount(0);
    }
  };
  

  const getFavoriteGenre = () => {
    if (favoriteMovies.length === 0) {
      console.log('No favorite genres found');
      return '';
    }
  
    const genreCountMap = favoriteMovies.reduce((countMap, movie) => {
      const genres = movie.genre;
      if (genres && Array.isArray(genres)) {
        for (const genre of genres) {
          countMap[genre] = (countMap[genre] || 0) + 1;
        }
      }
      return countMap;
    }, {});
  
    const topGenre = Object.keys(genreCountMap).reduce((a, b) => {
      return genreCountMap[a] > genreCountMap[b] ? a : b;
    });
  
    console.log('Top Genre:', topGenre);
  
    return topGenre || '-';
  };
  

  const deleteFavoriteMovie = async (movieId) => {
    const data = {
      movie_id: movieId,
      user_id: user.user_id,
    };
    try {
      const response = await fetch('http://localhost:3001/deletefav', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      console.log(result);

      fetchFavoriteMovies();
    } catch (error) {
      console.error('Error deleting favorite movie:', error);
    }
  };

  return (
    <div className="user-container">
      <div className="user-profile">
        <div className="user-photo">
          <FaRegUserCircle size={100} />
        </div>
        <div className="user-info">
          <h2 className="user-name">{defUsername}</h2>
          <p className="user-email">{defemail}</p>
        </div>
      </div>
      <div className="user-stats">
      <div className="fav-genre">
          <h2>Favorite genre</h2>
          <span className="genre-user">{favoriteGenre || '-'}</span>
        </div>
        <div className="fav-movies-count">
          <h2>Favorite Movie Tally</h2>
          <span className="genre-user">{favoriteMoviesCount}</span>
        </div>
      </div>
      <div className="favorite-movies">
        <h2 className="section-text">Favorite Movies</h2>
        <div className="fav-container">
          {favoriteMovies.length > 0 ? (
            favoriteMovies.map((movie) => {
              if (movie.genre && typeof movie.genre === 'string') {
                const genre = movie.genre.split(',')[0].trim();
                if (genre && favoriteGenre !== genre) {
                  setFavoriteGenre(genre);
                }
              }
              return (
                <MovieCard
                  movie={movie}
                  key={movie.id}
                  onDelete={() => deleteFavoriteMovie(movie.id)}
                />
              );
            })
          ) : (
            <div>
            <p className="checkfav-text">No Favorite Movies Found! </p> 
            <br />
            <p className="checkfav-text">Explore and Add Your Favourite Movies!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  ); 
};

export default User;
