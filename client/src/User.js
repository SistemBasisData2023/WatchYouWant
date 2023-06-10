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

      setFavoriteMovies(movies);
      setFavoriteMoviesCount(movies.length);
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      setFavoriteMovies([]);
      setFavoriteMoviesCount(0);
    }
  };

const getFavoriteGenre = () => {
  const moviesByGenre = groupBy(favoriteMovies, 'genre');
  console.log(moviesByGenre);

  const genreCounts = Object.entries(moviesByGenre).map(([genre, movies]) => {
    const genres = genre.split(',');
    return genres.map((genre) => genre.trim());
  });

  const flattenedGenres = genreCounts.flat();

  if (flattenedGenres.length === 0) {
    console.log('No favorite genres found');
    return '';
  }

  const genreCountMap = flattenedGenres.reduce((countMap, genre) => {
    countMap[genre] = (countMap[genre] || 0) + 1;
    return countMap;
  }, {});

  const topGenre = Object.keys(genreCountMap).reduce((a, b) => {
    return genreCountMap[a] > genreCountMap[b] ? a : b;
  });

  console.log('Top Genre:', topGenre);

  return topGenre;
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

      // Fetch the updated favorite movies after deleting a movie
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
          <span className="genre-user">{favoriteGenre}</span>
        </div>
        <div className="fav-movies-count">
          <h2>Favorite Movies Count</h2>
          <span className="genre-user">{favoriteMoviesCount}</span>
        </div>
      </div>
      <div className="favorite-movies">
        <h2 className="section-text">Favorite Movies</h2>
        <div className="fav-container">
        {favoriteMovies.map((movie) => {
          // Update the favorite genre whenever a movie is loaded
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
          })}
        </div>
      </div>
    </div>
  );
};

export default User;
