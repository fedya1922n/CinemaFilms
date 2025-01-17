import React from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/HomePage';
import IntoMovies from './components/IntoMovies/IntoMovies';
import Films from './components/Films/Films';
import HomePage from './components/Home/HomePage';

const App = () => {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/films" element={<Films/>} />
        <Route path="/IntoMovies/:mediaType/:movieId" element={<IntoMovies/>} />
      </Routes>
    </HashRouter>
  );
};

export default App;
