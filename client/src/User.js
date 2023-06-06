import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './User.css';
import MovieCard from './MovieCard';

const User = () => {
  const { email } = useParams();
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const fetchFavoriteMovies = async () => {
    try {
      const response = await fetch(
        'https://api.themoviedb.org/3/discover/movie?api_key=386cfa223814f4c1798b997fc2e52a5a&with_original_language=ja'
      );
      const data = await response.json();
      if (data.results) {
        setFavoriteMovies(data.results);
      } else {
        console.log('No Favorite Movies Found');
        setFavoriteMovies([]);
      }
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
      setFavoriteMovies([]);
    }
  };

  return (
    <div className="user-container">
      <div className="user-profile">
        <img
          src="https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599"
          alt="User Photo"
          className="user-photo"
        />
        <div className="user-info">
          <h2 className="user-name">User</h2>
          <p className="user-location">E-mail</p>
        </div>
      </div>
      <div className="user-stats">
        <div className="fav-genre">
          <h2>Favorite genre</h2>
          <span className="genre-user">Horror</span>
        </div>
        <div className="">
          <span className="count">723</span>
          <span className="label">Following</span>
        </div>
        <div className="stat">
          <span className="count">4433</span>
          <span className="label">Followers</span>
        </div>
      </div>
      <div className="user-comments">
        <div className="comment">
          <img
            src="https://api-cdn.spott.tv/rest/v004/image/images/e91f9cad-a70c-4f75-9db4-6508c37cd3c0?width=587&height=599"
            alt="Commenter Photo"
            className="comment-photo"
          />
          <div className="comment-content">
            <h4 className="comment-username">Mike Ross</h4>
            <p className="comment-text">
              Lorem ipsum dolor sit amet enim. Etiam ullamcorper. Suspendisse a pellentesque dui, non felis. Maecenas malesuada elit lectus felis, malesuada ultricies. Curabitur et ligula.
            </p>
            <span className="comment-date">Posted on: January 3, 2019</span>
          </div>
        </div>
      </div>
      <div className="favorite-movies">
        <h2 className="section-text">Favorite Movies</h2>
        <div className="container">
          {favoriteMovies.map((movie) => (
            <MovieCard movie={movie} key={movie.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
