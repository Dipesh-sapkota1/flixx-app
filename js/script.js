const global = {
  currentPage: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    apiKey: env.TMDB_API_KEY,
    apiUrl: env.TMDB_API_URL,
  },
};

// Display 20 popular movies
async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
  const popularMovies = document.querySelector('#popular-movies');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.original_title}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.original_title}" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.original_title}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
      </div>`;
    popularMovies.appendChild(div);
  });
}

// Display 20 popular TV shows
async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');
  const popularShows = document.querySelector('#popular-shows');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.original_name}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.original_name}" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.original_name}</h5>
        <p class="card-text">
          <small class="text-muted">Aired: ${show.first_air_date}</small>
        </p>
      </div>`;
    popularShows.appendChild(div);
  });
}

// Display movie details
async function displayMovieDetails() {
  // Bug fix: use URLSearchParams instead of split('=')[1]
  // split breaks if the URL ever has multiple = signs
  const movieId = new URLSearchParams(window.location.search).get('id');
  const movie = await fetchAPIData(`movie/${movieId}`);

  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
        ${
          movie.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" class="card-img-top" alt="${movie.title}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
        }
      </div>
      <div>
        <h2>${movie.title}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${movie.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>${movie.overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Movie Info</h2>
      <ul>
        <li><span class="text-secondary">Budget:</span> $${addCommasToNumbers(movie.budget)}</li>
        <li><span class="text-secondary">Revenue:</span> $${addCommasToNumbers(movie.revenue)}</li>
        <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
        <li><span class="text-secondary">Status:</span> ${movie.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${movie.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
      </div>
    </div>`;

  document.querySelector('#movie-details').appendChild(div);
}

// Display TV show details
async function displayShowDetails() {
  // Bug fix: use URLSearchParams instead of split('=')[1]
  const showId = new URLSearchParams(window.location.search).get('id');
  const show = await fetchAPIData(`tv/${showId}`);

  displayBackgroundImage('show', show.backdrop_path);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top">
      <div>
        ${
          show.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${show.poster_path}" class="card-img-top" alt="${show.original_name}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${show.original_name}" />`
        }
      </div>
      <div>
        <h2>${show.name}</h2>
        <p>
          <i class="fas fa-star text-primary"></i>
          ${show.vote_average.toFixed(1)} / 10
        </p>
        <p class="text-muted">First Air Date: ${show.first_air_date}</p>
        <p>${show.overview}</p>
        <h5>Genres</h5>
        <ul class="list-group">
          ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
        </ul>
        <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
      </div>
    </div>
    <div class="details-bottom">
      <h2>Show Info</h2>
      <ul>
        <li><span class="text-secondary">Number of Episodes:</span> ${show.number_of_episodes}</li>
        <li><span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.name}</li>
        <li><span class="text-secondary">Status:</span> ${show.status}</li>
      </ul>
      <h4>Production Companies</h4>
      <div class="list-group">
        ${show.production_companies.map((company) => `<span>${company.name}</span>`).join(', ')}
      </div>
    </div>`;

  document.querySelector('#show-details').appendChild(div);
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const { apiKey, apiUrl } = global.api;

  showSpinner();
  const response = await fetch(`${apiUrl}${endpoint}?api_key=${apiKey}&language=en-US`);
  const data = await response.json();
  hideSpinner();

  return data;
}

// Search request to TMDB API
async function searchAPIData() {
  const { apiKey, apiUrl } = global.api;

  showSpinner();
  const response = await fetch(
    `${apiUrl}search/${global.search.type}?api_key=${apiKey}&language=en-US&page=${global.search.page}&query=${global.search.term}`
  );
  const data = await response.json();
  hideSpinner();

  return data;
}

// Show spinner
function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

// Hide spinner
function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

// Highlight active nav link
function highlightActiveLinks() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Display backdrop image on detail pages
function displayBackgroundImage(type, backgroundPath) {
  const overlayDiv = document.createElement('div');
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = 'cover';
  overlayDiv.style.backgroundPosition = 'center';
  overlayDiv.style.backgroundRepeat = 'no-repeat';
  overlayDiv.style.height = '200vh';
  overlayDiv.style.width = '100vw';
  overlayDiv.style.position = 'absolute';
  overlayDiv.style.top = '0';
  overlayDiv.style.left = '0';
  overlayDiv.style.zIndex = '-1';
  overlayDiv.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlayDiv);
  } else {
    document.querySelector('#show-details').appendChild(overlayDiv);
  }
}

// Search movies/shows
async function search() {
  const urlParams = new URLSearchParams(window.location.search);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');

  if (!global.search.term) {
    showAlert('Please enter a search term');
    return;
  }

  const { results, total_pages, page, total_results } = await searchAPIData();

  global.search.page = page;
  global.search.totalPages = total_pages;
  global.search.totalResults = total_results;

  if (results.length === 0) {
    showAlert('No results found');
    return;
  }

  displayResults(results);
}

// Display search results
function displayResults(results) {
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((item) => {
    const isMovie = global.search.type === 'movie';
    const title = isMovie ? item.title : item.original_name;
    const date = isMovie ? item.release_date : item.first_air_date;
    const detailPage = isMovie ? 'movie-details.html' : 'tv-details.html';

    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="${detailPage}?id=${item.id}">
        ${
          item.poster_path
            ? `<img src="https://image.tmdb.org/t/p/w500${item.poster_path}" class="card-img-top" alt="${title}" />`
            : `<img src="images/no-image.jpg" class="card-img-top" alt="${title}" />`
        }
      </a>
      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">
          <small class="text-muted">${isMovie ? 'Release' : 'Aired'}: ${date}</small>
        </p>
      </div>`;

    document.querySelector('#search-results').appendChild(div);
  });

  document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for "${global.search.term}"</h2>`;

  displayPagination();
}

// Create and display pagination
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
    <button class="btn btn-primary" id="next">Next</button>
    <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector('#pagination').appendChild(div);

  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }
  if (global.search.page === global.search.totalPages) {
    document.querySelector('#next').disabled = true;
  }

  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results } = await searchAPIData();
    displayResults(results);
  });

  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results } = await searchAPIData();
    displayResults(results);
  });
}

// Show alert message
function showAlert(message, className = 'error') {
  const div = document.createElement('div');
  div.classList.add('alert', className);
  div.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(div);

  setTimeout(() => div.remove(), 3000);
}

// Display now playing slider
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
      </h4>`;

    document.querySelector('.swiper-wrapper').appendChild(div);
  });

  initSwiper();
}

// Initialize Swiper
function initSwiper() {
  new Swiper('.swiper', {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    breakpoints: {
      250: { slidesPerView: 1 },
      500: { slidesPerView: 2 },
      700: { slidesPerView: 3 },
      1200: { slidesPerView: 4 },
    },
  });
}

// Add commas to numbers
function addCommasToNumbers(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Initialize app — route to correct function based on current page
function init() {
  const path = global.currentPage;

  // Bug fix: use endsWith instead of exact match so routing works
  // whether served from localhost root or a subdirectory
  if (path === '/' || path.endsWith('index.html')) {
    displaySlider();
    displayPopularMovies();
  } else if (path.endsWith('movie-details.html')) {
    displayMovieDetails();
  } else if (path.endsWith('shows.html')) {
    displayPopularShows();
  } else if (path.endsWith('tv-details.html')) {
    displayShowDetails();
  } else if (path.endsWith('search.html')) {
    search();
  }

  highlightActiveLinks();
}

document.addEventListener('DOMContentLoaded', init);