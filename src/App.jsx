import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import IntoMovies from './components/IntoMovies/IntoMovies';
import Films from './components/Films/Films';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Films/>} />
        <Route path="/IntoMovies/:mediaType/:movieId" element={<IntoMovies/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
