import React from 'react';
import "./Home.css"
import { centryImg, DisneyImg, DreanWorksImg } from '../../assets/image/image';

const HomePage = () => {
  return (
    <div className="Home">
      <section className='section'>
        <div className="section__menu">
          <p className="section__desc">
            Cinema Films — это веб-сайт, посвящённый мировому кинематографу, который предлагает пользователю разнообразную информацию о фильмах, актёрах, режиссёрах и киноновинках. Сайт предназначен для создания удобной и интерактивной платформы, где можно ознакомиться с деталями фильмов, их рецензиями, трейлерами, а также просматривать актуальные новости киноиндустрии.
          </p>
          <p className='section__desc-2'>
            Основные функции:
            <br />
            - Главная страница с анонсами популярных фильмов и трейлеров.
            <br />
            - Страница каталога фильмов с возможностью фильтрации по жанрам, рейтингу, году выпуска и прочее.
            <br />
            - Динамичные страницы фильмов с подробной информацией: сюжет, актёры, трейлеры, рецензии.
            <br />
            - Страница новостей кино с последними событиями и интервью.
            <br />
            - Поддержка мобильных устройств и адаптивный дизайн для различных экранов.
          </p>
        </div>
      </section>

      <section className="Films__Animate">
        <div className="Films__Animate-inner">
          <img src={centryImg} alt="centry" className="Films__Animate-img" />
          <img src={DreanWorksImg} alt="dreamWorks" className="Films__Animate-img" />
          <img src={DisneyImg} alt="disney" className="Films__Animate-img" />
          
          <img src={centryImg} alt="centry" className="Films__Animate-img" />
          <img src={DreanWorksImg} alt="dreamWorks" className="Films__Animate-img" />
          <img src={DisneyImg} alt="disney" className="Films__Animate-img" />
        </div>
      </section>

    </div>
  );
}

export default HomePage;
