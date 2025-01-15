import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './intoMovies.css';
import { loadingImg } from '../../assets/image/image';

interface Movie {
  title?: string;
  name?: string;
  overview?: string;
  vote_average?: number;
  poster_path?: string;
  trailerKey?: string;
  imdb_id?: string;
}

const IntoMovies: React.FC = () => {
  const { mediaType, movieId } = useParams<{ mediaType: string; movieId: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = import.meta.env.VITE_API_KEY as string; 
  const API_URL = `https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${API_KEY}&language=ru-RU`;

  const fetchTrailer = async (): Promise<string | null> => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/${mediaType}/${movieId}/videos?api_key=${API_KEY}&language=ru-RU`);
      return response.data.results[0]?.key || null;
    } catch (err) {
      console.error('Ошибка при загрузке трейлера:', err);
      return null;
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      console.log("Fetching details for:", mediaType, movieId);

      if (!mediaType || !movieId) {
        setError('Некорректные параметры URL.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(API_URL);
        const trailerKey = await fetchTrailer();
        const movieData = { ...response.data, trailerKey };

        setMovie(movieData);
        setLoading(false);
      } catch (err) {
        console.error('Ошибка при загрузке данных о фильме:', err);
        setError('Ошибка при загрузке данных о фильме.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [API_URL, mediaType, movieId]);

  if (loading) return (
    <div className='loading'>
      <img src={loadingImg} alt="loading" className="loading__img" />
    </div>
  );

  if (error) return <p>{error}</p>;

  if (!movie) return <p>Нет данных для отображения</p>;

  return (
    <div className='Film__card'>
      <h1 className='Film__card-title'>{movie.title || movie.name}</h1>
      <p className='Film__card-desc'>Описание: {movie.overview || 'Описание недоступно.'}</p>
      <p className='Film__card-rating'>Рейтинг: {movie.vote_average}</p>
      <img className='Film__card-img'
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title || movie.name}
        width="200"
      />

      {movie.trailerKey ? (
        <div className="trailer">
          <h3 className='trailer__title'>Трейлер:</h3>
          <iframe className='trailer__video'
            src={`https://www.youtube.com/embed/${movie.trailerKey}`}
            title={movie.title || movie.name}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>Нету трейлера :(</p>
      )}

      {movie.imdb_id ? (
        <div className="imdb__link">
          <p>Вы можете посмотреть фильм на IMDb:</p>
          <a className='imbd__link-a' href={`https://www.imdb.com/title/${movie.imdb_id}`} target="_blank" rel="noopener noreferrer">
            {movie.title || movie.name} на IMDb
          </a>
        </div>
      ) : (
        <p>Для этого фильма нет IMDb ссылки.</p>
      )}
    </div>
  );
};

export default IntoMovies;
