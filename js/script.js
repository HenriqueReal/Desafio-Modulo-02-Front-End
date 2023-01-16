const posterMovies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');


let pageMovies = 0;
let currentPage = [];
let currentPageSearch = [];

const maxPage = 2;
const minPage = 0;


async function watchMovies(movies) {
  await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')
  .then(function(response) {
    if (currentPage.length < 18) {
      for (let i = 0; i < 18; i++) {
        currentPage.push(response.data.results[i]);
      };
    };
  
    let indexMovies = 0;
    for (let movie of movies) {
      const divMovie = document.createElement('div');
      divMovie.classList.add('movie');
      divMovie.style.backgroundImage = `url(${movie.poster_path})`;
      divMovie.id = movie.id;
      divMovie.addEventListener('click', (event) => {
        createModal(event.target.id, movies);
      });

      const divMovieInfo = document.createElement('div');
      divMovieInfo.classList.add('movie__info');

      const spanTitle = document.createElement('span');
      spanTitle.classList.add('movie__title');

      const spanRating = document.createElement('span');
      spanRating.classList.add('movie__rating');

      const starRating = document.createElement('img');
      starRating.src = './assets/estrela.svg';
      starRating.alt = 'Estrela';

      spanTitle.textContent = movie.title;
      spanRating.textContent = movie.vote_average;

      posterMovies.appendChild(divMovie);
      divMovie.appendChild(divMovieInfo);
      divMovieInfo.appendChild(spanTitle);
      divMovieInfo.appendChild(spanRating);
      spanRating.appendChild(starRating);

      if (indexMovies > 5) {
        divMovie.style.display = 'none';
      }
      indexMovies++;
    };
  })
  .catch(function(error) {
        console.log(error);
      })
};

watchMovies(currentPage);

function getMovies(pageMovies) {
  const divMovie = document.querySelectorAll('.movie');

  for (let index = 0; index < divMovie.length; index++) {
    if (pageMovies === 0 && index >= 0 && index < 6) {
      divMovie[index].style.display = 'flex';
    } else if (pageMovies === 1 && index >= 6 && index < 12) {
      divMovie[index].style.display = 'flex';
    } else if (pageMovies === 2 && index >= 12 && index < 18) {
      divMovie[index].style.display = 'flex';
    } else {
      divMovie[index].style.display = 'none';
    };
  };
};

btnPrev.addEventListener('click', (event) => {
  event.stopPropagation();
  pageMovies--;

  if (pageMovies < minPage) {
    pageMovies = maxPage;
  };
  getMovies(pageMovies);
});

btnNext.addEventListener('click', (event) => {
  event.stopPropagation();
  pageMovies++;

  if (pageMovies > maxPage) {
    pageMovies = minPage;
  };
  getMovies(pageMovies);
});

const searchMoviesInput = document.querySelector('input');

async function searchMovies() {
  if(!searchMoviesInput.value) {
    pageMovies = minPage;
    getMovies(pageMovies);
  };

  if(searchMoviesInput.value !== '') {
    await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=' + searchMoviesInput.value)
      .then(function(response) {
        currentPageSearch = [];
        for(let i = 0; i < 6; i++) {
          currentPageSearch.push(response.data.results[i]);
        };
        watchMovies(currentPageSearch);
      })
      .catch(function(error) {
        console.log(error);
      })
      searchMoviesInput.value = "";
  };
};

searchMoviesInput.addEventListener('keydown',(event) => {
  if (event.key === 'Enter') {
    hiddenMovies();
    searchMovies();
  };
});

function hiddenMovies () {
  const divMovie = document.querySelectorAll('.movie');

  for (let i = 0; i < divMovie.length; i++) {
    divMovie[i].style.display = 'none';
  };
};

const highlightVideo = document.querySelector('.highlight__video');
const highlightTitleH1 = document.querySelector('.highlight__title');
const highlightRatingSpan = document.querySelector('.highlight__rating');
const highlightSpanGenre = document.querySelector('.highlight__genres');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const highlightSpanLaunch = document.querySelector('.highlight__launch');

async function dayMovie() {
  const response = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
  let movieOfTheDay = response.data.results[0].id
  const cardMovie = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieOfTheDay}?language=pt-BR`);
  const trailerMovie = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${movieOfTheDay}/videos?language=pt-BR`);

  highlightVideo.style.backgroundImage = `url(${cardMovie.data.backdrop_path})`;
  highlightVideo.style.backgroundSize = 'cover';

  highlightTitleH1.textContent = cardMovie.data.title;

  highlightRatingSpan.textContent = cardMovie.data.vote_average.toFixed(1);

  highlightSpanGenre.textContent = cardMovie.data.genres.map((genres)=> genres.name).join(', ');

  highlightDescription.textContent = cardMovie.data.overview;

  highlightVideoLink.href = `https://www.youtube.com/watch?v=${trailerMovie.data.results[0].key}`;

  highlightSpanLaunch.textContent = new Date(cardMovie.data.release_date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

dayMovie();

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitleH3 = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescriptionP = document.querySelector('.modal__description');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');

async function createModal(idMovie) {
  const cardModal = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idMovie}?language=pt-BR`);
  
  modalGenres.textContent = '';

  modal.classList.remove('hidden');

  modalTitleH3.textContent = cardModal.data.title;

  modalImg.src = cardModal.data.backdrop_path;

  modalDescriptionP.textContent = cardModal.data.overview;

  modalAverage.textContent = cardModal.data.vote_average.toFixed(1);
  
  modal.addEventListener('click',(event) => {
    modal.classList.add('hidden');
    event.stopPropagation();
  })
  
  modalClose.addEventListener('click',(event) => {
    modal.classList.add('hidden');
    event.stopPropagation();
  });
  
  for (const genre of cardModal.data.genres) {
    const spanGenre = document.createElement('span');
    spanGenre.textContent = genre.name;
    spanGenre.classList.add('modal__genre');
    
    modalGenres.appendChild(spanGenre);
  }
};

const body = document.querySelector('body');
const logo = document.querySelector('.header__container-logo img');
const btnTheme = document.querySelector('.btn-theme');
let currentTheme = 'ligth';

function darkMode() {
  currentTheme = 'dark';
  logo.src = './assets/logo.svg';
  btnTheme.src = './assets/dark-mode.svg';
  btnPrev.src = './assets/arrow-left-light.svg';
  btnNext.src = './assets/arrow-right-light.svg';
  body.style.setProperty('--background','#1B2028');
  body.style.setProperty('--text-color','#FFFFFF');
  body.style.setProperty('--input-color','#2D3440');
  searchMoviesInput.style.backgroundColor = '#3E434D';
  body.style.setProperty('--bg-secondary','#2D3440');
  body.style.setProperty('--bg-modal','#2D3440');
  modalClose.src = './assets/close.svg';  
};

function lightMode() {
  currentTheme = 'ligth'
  logo.src = './assets/logo-dark.png';
  btnTheme.src = './assets/light-mode.svg';
  btnPrev.src = './assets/arrow-left-dark.svg';
  btnNext.src = './assets/arrow-right-dark.svg';
  body.style.setProperty('--background','#fff');
  body.style.setProperty('--text-color','#1b2028');
  body.style.setProperty('--input-color','#979797');
  searchMoviesInput.style.backgroundColor = '#FFFFFF';
  body.style.setProperty('--bg-secondary','#ededed');
  body.style.setProperty('--bg-modal','#ededed');
  modalClose.src = './assets/close-dark.svg'; 
};

function toggleDarkMode() {
  if (currentTheme === 'dark') {
    lightMode();
  } else {
    darkMode();
  }
};

btnTheme.addEventListener('click',() => {
  toggleDarkMode();
});