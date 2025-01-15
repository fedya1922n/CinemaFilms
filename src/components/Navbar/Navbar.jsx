import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isNightTheme, setIsNightTheme] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'day') {
      setIsNightTheme(false);
      document.body.classList.add('day-theme');
      document.body.classList.remove('night-theme');
    } else {
      setIsNightTheme(true);
      document.body.classList.add('night-theme');
      document.body.classList.remove('day-theme');
    }
  }, []);
  const toogleTheme = () => {
    setIsNightTheme(prevTheme => {
      const newTheme = !prevTheme;
      if (newTheme) {
        document.body.classList.add('night-theme');
        document.body.classList.remove('day-theme');
        localStorage.setItem('theme', 'night');
      } else {
        document.body.classList.add('day-theme');
        document.body.classList.remove('night-theme');
        localStorage.setItem('theme', 'day');
      }
      return newTheme;
    });
  };

  return (
    <div className="navbar">
      <div className="navbar__menu">
        <h1 className="navbar__menu-title">Cinema Films</h1>
        <Link to="/" className="navbar__link">Home</Link>
        <Link to="/films" className="navbar__link">Films</Link>
        <Link to="/" className="navbar__link">About us</Link>
        <div onClick={toogleTheme} className="navbar__website-theme">
          {isNightTheme ? 'Светлая тема' : 'Обычная тема'}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
