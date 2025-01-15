import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './films.css';
import "../../index.css";
import { Link } from 'react-router-dom';
import { loadingImg } from '../../assets/image/image';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  overview: string;
  vote_average: number;
}

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  media_type: string;
}

const Films: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [animeShows, setAnimeShows] = useState<TVShow[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [noResults, setNoResults] = useState<boolean>(false);

  const API_KEY = import.meta.env.VITE_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';
  const API_URL_MOVIES_POPULAR = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=ru-RU&page=1&region=RU`;
  const API_URL_TV_POPULAR = `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=ru-RU&page=1&region=RU`;
  const API_URL_ANIME = `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=16&language=ru-RU&page=1`;
  const API_URL_GENRES = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=ru-RU`;
  const API_URL_SEARCH = `${BASE_URL}/search/multi?api_key=${API_KEY}&language=ru-RU&query=`;

  const fetchMultiplePages = async (url: string, totalPages: number = 5): Promise<any[]> => {
    const results: any[] = [];
    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(`${url}&page=${page}`);
      results.push(...response.data.results);
    }
    return results;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchMultiplePages(API_URL_MOVIES_POPULAR, 5);
        setMovies(movieData);

        const tvData = await fetchMultiplePages(API_URL_TV_POPULAR, 5);
        setTvShows(tvData);

        const animeData = await fetchMultiplePages(API_URL_ANIME, 5);
        setAnimeShows(animeData);

        const genreResponse = await axios.get(API_URL_GENRES);
        setGenres(genreResponse.data.genres);

        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_URL_SEARCH}${encodeURIComponent(searchQuery)}`);
      const results = response.data.results;

      if (results.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
        const filteredResults = results.filter((result: any) => {
          const title = result.title || result.name;
          return title.toLowerCase().includes(searchQuery.toLowerCase());
        });

        setSearchResults(filteredResults);
      }
      setLoading(false);
    } catch (err) {
      setError('Ошибка при выполнении поиска.');
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleGenreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(event.target.value);
  };

  const filterByGenre = (items: any[], genreId: string) => {
    return items.filter((item) => item.genre_ids && item.genre_ids.includes(parseInt(genreId)));
  };

  const filteredMovies = selectedGenre ? filterByGenre(movies, selectedGenre) : movies;
  const filteredTvShows = selectedGenre ? filterByGenre(tvShows, selectedGenre) : tvShows;
  const filteredAnimeShows = selectedGenre ? filterByGenre(animeShows, selectedGenre) : animeShows;

  if (loading) return <div className='loading'>
    <img className='loading__img' src={loadingImg} alt="Loading" />
  </div>;

  if (error) return <p>{error}</p>;

  return (
    <div className='Films'>
      <h1 className='Films__title'>Фильмы, сериалы и аниме</h1>

      <div className='Films__search'>
        <input
          type="text"
          placeholder="Введите название"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
          className="Films__search-input"
        />
        <button onClick={handleSearch} className="Films__search-button">Поиск</button>
      </div>

      <div className='Films__genre-selector'>
        <select onChange={handleGenreChange} value={selectedGenre}>
          <option value="">Все жанры</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      {noResults && (
        <p>По вашему запросу ничего не удалось найти :(</p>
      )}

      {searchResults.length > 0 && !noResults && (
        <>
          <h1 className='Films__title'>Результаты поиска</h1>
          <div className='Films-container'>
            {searchResults.map((result, index) => (
              <div key={`search-${result.id}-${index}`} className='Films__card'>
                <h2 className='Films__card-title'>{result.title || result.name}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${result.poster_path}`}
                  alt={result.title || result.name}
                  width="200"
                  className='Films__card-img'
                />
                <p className='Films__card-desc'>
                  Описание: {result.overview || 'Описание недоступно.'}
                </p>
                <p className='Films__card-rating'>
                  Рейтинг: {result.vote_average || 'Нет рейтинга'}
                </p>
                {result.media_type && result.id ? (
                  <Link to={`/IntoMovies/${result.media_type}/${result.id}`} className="Films__card-link">
                    Посмотреть
                  </Link>
                ) : (
                  <p>Неподдерживаемый тип мультимедиа</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {filteredMovies.length > 0 && (
        <>
          <h1 className='Films__title'>Популярные фильмы</h1>
          <div className='container'>
            {filteredMovies.map((movie, index) => (
              <div key={`movie-${movie.id}-${index}`} className='Films__card'>
                <h2 className='Films__card-title'>{movie.title}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  width="200"
                  className='Films__card-img'
                />
                <p className='Films__card-desc'>
                  Описание: {movie.overview || 'Описание недоступно.'}
                </p>
                <p className='Films__card-rating'>
                  Рейтинг: {movie.vote_average}
                </p>
                <Link to={`/IntoMovies/movie/${movie.id}`} className="Films__card-link">
                  Посмотреть
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredTvShows.length > 0 && (
        <>
          <h1 className='Films__title'>Популярные сериалы</h1>
          <div className='container'>
            {filteredTvShows.map((tvShow, index) => (
              <div key={`tvShow-${tvShow.id}-${index}`} className='Films__card'>
                <h2 className='Films__card-title'>{tvShow.name}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`}
                  alt={tvShow.name}
                  width="200"
                  className='Films__card-img'
                />
                <p className='Films__card-desc'>
                  Описание: {tvShow.overview || 'Описание недоступно.'}
                </p>
                <p className='Films__card-rating'>
                  Рейтинг: {tvShow.vote_average}
                </p>
                <Link to={`/IntoMovies/tv/${tvShow.id}`} className="Films__card-link">
                  Посмотреть
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      {filteredAnimeShows.length > 0 && (
        <>
          <h1 className='Films__title'>Популярное аниме</h1>
          <div className='container'>
            {filteredAnimeShows.map((animeShow, index) => (
              <div key={`animeShow-${animeShow.id}-${index}`} className='Films__card'>
                <h2 className='Films__card-title'>{animeShow.name}</h2>
                <img
                  src={`https://image.tmdb.org/t/p/w500${animeShow.poster_path}`}
                  alt={animeShow.name}
                  width="200"
                  className='Films__card-img'
                />
                <p className='Films__card-desc'>
                  Описание: {animeShow.overview || 'Описание недоступно.'}
                </p>
                <p className='Films__card-rating'>
                  Рейтинг: {animeShow.vote_average}
                </p>
                <Link to={`/IntoMovies/tv/${animeShow.id}`} className="Films__card-link">
                  Посмотреть
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Films;
