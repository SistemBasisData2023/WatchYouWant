import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './User.css';
import MovieCard from './MovieCard';
import { FaRegUserCircle } from 'react-icons/fa';

const User = ({ user, username, email }) => {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const defUsername = username || 'User';
  const defemail = email || 'No Email Found';

  useEffect(() => {
    console.log(user.user_id);
    fetchFavoriteMovies();
  }, []);

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
  
      if (movies.length > 0) {
        setFavoriteMovies(movies);
      } else {
        console.log('No Favorite Movies Found');
        setFavoriteMovies([]);
      }
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      setFavoriteMovies([]);
    }
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
          <span className="genre-user">Horror</span>
        </div>
        <div className="fav-movies-count">
          <h2>Favorite Movies Count</h2>
          <span className="genre-user">Horror</span>
        </div>
        <div className="fav-genre">
          <h2>Favorite genre</h2>
          <span className="genre-user">Horror</span>
        </div>
      </div>
      <div className="favorite-movies">
        <h2 className="section-text">Favorite Movies</h2>
        <div className="fav-container">
          {favoriteMovies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.id}
              onDelete={() => deleteFavoriteMovie(movie.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
