import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie, onDelete }) => {
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
  const navigate = useNavigate();
  const isUserPage = window.location.href.includes('localhost:3000/user');

  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    onDelete(movie.id);
  };

  return (
    <>
      <div className="movie">
        <div>
          <p>{releaseYear}</p>
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
      {isUserPage && (
        <div className="delete-circle">
          <button className="btn" onClick={handleDelete}>
            <svg viewBox="0 -5 15 27" height="35" width="30" xmlns="http://www.w3.org/2000/svg" className="icon">
              <circle cx="100" cy="4.5" r="4" fill="#FF5252" />
              <path transform="translate(-2.5 -1.25)" d="M15,18.75H5A1.251,1.251,0,0,1,3.75,17.5V5H2.5V3.75h15V5H16.25V17.5A1.251,1.251,0,0,1,15,18.75ZM5,5V17.5H15V5Zm7.5,10H11.25V7.5H12.5V15ZM8.75,15H7.5V7.5H8.75V15ZM12.5,2.5h-5V1.25h5V2.5Z" id="Fill"></path>
            </svg>
          </button>
        </div>
      )}
    </>
  );
};

export default MovieCard;
