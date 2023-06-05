import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './Movie.css';
import App from './App';


const API_KEY = '386cfa223814f4c1798b997fc2e52a5a';

const Movie = () => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
        const response = await fetch(movieUrl);
        const data = await response.json();
        setMovieDetails(data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovieDetails(null);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`;
        const response = await fetch(videosUrl);
        const data = await response.json();
        const trailerVideos = data.results.filter(video => video.name.toLowerCase().includes('trailer'));
        setMovieDetails(prevDetails => ({
          ...prevDetails,
          videos: trailerVideos,
        }));
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    };
  
    if (movieDetails) {
      fetchVideos();
    }
  }, [id, movieDetails]);

  return (
    <div className="movie-title">
      {movieDetails ? (
        <>
          <div className="movie-header">
            <h2 className="movie-title">{movieDetails.title}</h2>
            <div className="movie-media">
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
                alt={movieDetails.title}
              />
              {movieDetails.videos?.length > 0 && (
                <Container className="trailer-container">
                  <div className="ratio ratio-16x9">
                    <iframe
                      src={`https://www.youtube.com/embed/${movieDetails.videos[0].key}?rel=0`}
                      title="YouTube video player"
                      allowFullScreen
                    ></iframe>
                  </div>
                </Container>
              )}
            </div>
          </div>
          <div className="movie-details">
          <h3>Movie Overview</h3>
          <p className="movie-overview">{movieDetails.overview}</p>

          <div className="additional-details">
            <h3>Additional Details</h3>
            <ul>
              <li><strong>Release Date:</strong> {movieDetails.release_date}</li>
              <li><strong>Cast:</strong> {movieDetails.credits?.cast.map(cast => cast.name).join(", ")}</li>
              {/* Add more additional details as needed */}
            </ul>
          </div>
        </div>

      </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Movie;
