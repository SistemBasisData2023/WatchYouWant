import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie" onClick={handleCardClick}>
      <div>
        <p>{releaseYear}</p> {/* Display only the year */}
      </div>

      <div>
        <Link to={`/movie/${movie.id}`}>
          <img
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://via.placeholder.com/400"}
            alt={movie.title}
          />
        </Link>
      </div>

      <div>
        <span>{movie.media_type}</span>
        <h3 className="non-editable">{movie.title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;
