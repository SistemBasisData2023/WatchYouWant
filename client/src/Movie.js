import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import './Movie.css';
import { FaRegUserCircle } from 'react-icons/fa';
import ReactStars from 'react-rating-stars-component';

const API_KEY = '386cfa223814f4c1798b997fc2e52a5a';

const Movie = ({ user }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [favoriteMovieIds, setFavoriteMovieIds] = useState([]);
  const commentUsername = user.username || 'User';
  const [rating, setRating] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  const [movieGenre, setMovieGenre] = useState(null);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleCheckboxChange = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getfav/${user.user_id}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const fetchedFavoriteMovieIds = data.map((movie) => movie.id);
          const movieExists = fetchedFavoriteMovieIds.includes(id);
          if (movieExists) {
            alert('Movie is already in favorites');
            return;
          }
        }
  
        const requestData = {
          movie_id: id,
          user_id: user.user_id,
        };
  
        const addResponse = await fetch(`http://localhost:3001/addfav`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
  
        if (addResponse.ok) {
          if (!favoriteMovieIds.includes(id)) {
            setFavoriteMovieIds((prevIds) => [...prevIds, id]);
            alert('Movie successfully added to favorites');
          } else {
            alert('Movie is already in favorites');
          }
        } else {
          alert('Failed adding to favorites');
        }
      } else {
        console.error('Error fetching favorites:', response.statusText);
      }
    } catch (error) {
      console.error('Error handling favorites:', error);
    }
  };
  
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (commentText.trim() !== '') {
      const newComment = {
        username: commentUsername,
        content: commentText,
        date: new Date().toLocaleDateString(),
      };
      try {
        const data = {
          movie_id: id,
          user_id: user.user_id,
          comment: commentText,
        };
        const response = await fetch('http://localhost:3001/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (response.ok) {
          setComments((prevComments) => [...prevComments, newComment]);
          setCommentText('');
        } else {
          console.error('Error adding comment:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:3001/getcomment/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      } else {
        console.error('Error fetching comments:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleRatingSubmit = async () => {
    try {
      const data = {
        movie_id: id,
        user_id: user.user_id,
        rating: rating
      };
      const response = await fetch('http://localhost:3001/addrating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        alert('Rating successfully added');
        window.location.reload();
      } else {
        alert('Failed to add rating');
      }
    } catch (error) {
      console.error('Failed to add rating:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`;
        const response = await fetch(movieUrl);
        const data = await response.json();
        setMovieDetails(data);

        const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`;
        const genreResponse = await fetch(genreUrl);
        const genreData = await genreResponse.json();
        const genreMap = {};
        genreData.genres.forEach((genre) => {
          genreMap[genre.id] = genre.name;
        });
        setMovieGenre(genreMap);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setMovieDetails(null);
      }
    };

    fetchMovieDetails();
  }, [id]);

  

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}`;
        const response = await fetch(creditsUrl);
        const data = await response.json();
        if (!movieDetails.credits) {
          setMovieDetails((prevDetails) => ({
            ...prevDetails,
            credits: data,
          }));
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    if (movieDetails) {
      fetchCredits();
    }
  }, [id, movieDetails]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const videosUrl = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`;
        const response = await fetch(videosUrl);
        const data = await response.json();
        const trailerVideos = data.results.filter((video) =>
          video.name.toLowerCase().includes('trailer')
        );
        setMovieDetails((prevDetails) => ({
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

  useEffect(() => {
    const fetchUserFavorites = async () => {
      try {
        const response = await fetch(`http://localhost:3001/getfav/${user.user_id}`);
        const data = await response.json();
  
        if (response.ok) {
          const favoriteMovieIds = data.map((movie) => movie.id);
          setFavoriteMovieIds(favoriteMovieIds);
        } else {
          console.error('Error fetching favorites:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
  
    fetchUserFavorites();
  }, [user.user_id]);
  

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        const response = await fetch(`http://localhost:3001/getrating/${id}`);
        if (response.ok) {
          const data = await response.json();
          setAverageRating(Number(data.averageRating));
        } else {
          console.error('Failed to fetch average rating:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch average rating:', error);
      }
    };
    fetchAverageRating();
  }, [id]);

  
  return (
    <div className="movie-container">
      {movieDetails ? (
        <>
          <div className="movie-header">
          <div className="title-wrapper">
            <h2 className="movie-title">{movieDetails.title}</h2>
          </div>
          <div className="fav-icon">
              <label className="con-fav">
                <input type="checkbox" className="fav" onChange={handleCheckboxChange} checked={favoriteMovieIds.includes(id)} />
                <div className="checkmark">
                  <svg viewBox="0 0 24 24" className="outline" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z"></path>
                  </svg>
                  <svg viewBox="0 0 24 24" className="filled" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z"></path>
                  </svg>
                  <svg className="celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="10,10 20,20" className="poly"></polygon>
                    <polygon points="10,50 20,50" className="poly"></polygon>
                    <polygon points="20,80 30,70" className="poly"></polygon>
                    <polygon points="90,10 80,20" className="poly"></polygon>
                    <polygon points="90,50 80,50" className="poly"></polygon>
                    <polygon points="80,80 70,70" className="poly"></polygon>
                  </svg>
                </div>
              </label>
            </div>
          </div>
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
            <div className='avgrating-container'>
              {averageRating ? (
                <p className="rating-avg">
                  <span className="rating-text">Average Users Rating</span> <br /> {averageRating.toFixed(2)}{' '}
                  <span className='avgstar' role="img" aria-label="star">
                    ★
                  </span>
                </p>
              ) : (
                <p>{averageRating !== null ? 'No User Rating Available!' : 'Loading average rating...'}</p>
              )}
            </div>
          <div className="movie-text-container">
          <div className="movie-details">
            <h3>Movie Overview</h3>
            <p className="movie-comp">{movieDetails.overview}</p>
            <div className="additional-details">
              <div className="release-date">
                <h3>Release Date</h3>
                <p className="movie-comp">{movieDetails.release_date}</p>
              </div>
              <div className="cast-list">
                <h3>Cast</h3>
                <ul className="movie-comp">
                  {movieDetails.credits?.cast.slice(0, 5).map((cast) => (
                    <li key={cast.id}>{cast.name}</li>
                  ))}
                </ul>
              </div>
              <div className="genre">
                <h3>Genre</h3>
                <ul className="movie-comp">
                  {movieDetails.genres.map((genre) => (
                    <li key={genre.id}>{genre.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          </div>
          <div className="rating-container">
                <h3 className="rating-heading">Rate this movie</h3>
                <ReactStars
                  count={5}
                  value={rating}
                  onChange={handleRatingChange}
                  size={80}
                  activeColor="#ffd700"
                />
                <div>
                <Button className="custom-btn" variant="primary" onClick={handleRatingSubmit}>
                Submit Rating
                </Button>
                </div>
          </div>
        <div className="comments">
        <h3 className="comment-top">Comments</h3>
        {comments.length === 0 ? (
          <p className='c-placeholder'>No comments yet.</p>
        ) : (
          comments.map((comment, index) => (
            <div className="comment" key={index}>
              <div className="comment-header">
                <div className="comment-icon">
                  <FaRegUserCircle size={70} />
                </div>
                <h4 className="comment-username">{comment.username}</h4>
              </div>
              <div className="comment-content">
                <p className="comment-text">{comment.content}</p>
                <span className="comment-date">Posted on: {comment.date}</span>
              </div>

            </div>
          ))
        )}
      <div className="comment-form">
        <Form onSubmit={handleCommentSubmit}>
          <Form.Group controlId="commentForm">
            <Form.Label>Your Comment</Form.Label>
            <div className='comment-input-bar'>
              <input
                placeholder="Comment"
                type="text"
                className="input-comment"
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
          </Form.Group>
          <Button className="custom-btn" variant="primary" type="submit">
            Post Comment
          </Button>
        </Form>
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
