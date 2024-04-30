const global = {
  currentPage: window.location.pathname,
  search:{
    term: '',
    type: '',
    page: 1,
    totalPages:1,
    totalResults:0
  },
  api:{
    apiKey:'538ba0ec2e8486cb1c1ca87b55b55992',
    apiUrl: 'https://api.themoviedb.org/3/' 
  }
};
 

//Display 20 popular movies
async function displayPopularMovies(){
    const {results} = await fetchAPIData('movie/popular');
    const popularMovies = document.querySelector('#popular-movies');
    results.forEach((movie)=>{
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `   <a href="movie-details.html?id=${movie.id}">
      ${
        movie.poster_path 
        ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.original_title}"/>`:`<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.original_title}"/>`
      }
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.original_title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>`;
    popularMovies.appendChild(div);
    })

    
  }
//Display 20 popular Tv shows
  async function displayPopularShows(){
    const {results} = await fetchAPIData('tv/popular');
    const popularShows = document.querySelector('#popular-shows');
    results.forEach((show)=>{
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = ` <a href="tv-details.html?id=${show.id}">
     ${
      show.poster_path
      ? ` <img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.original_name}"
    />`: `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${show.original_name}/>`
     }
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.original_name}</h5>
      <p class="card-text">
        <small class="text-muted">Aired: ${show.first_air_date}</small>
      </p>
    </div>`;
    popularShows.appendChild(div);
    })
  }

  // Display Movie Details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1];

  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${movie.title}"
/>`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumbers(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumbers(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${movie.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>
</div>
  `;

  document.querySelector('#movie-details').appendChild(div);
}

//Display show details
async function displayShowDetails() {
  const showId = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${showId}`);
console.log(show);
  // Overlay for background image
  displayBackgroundImage('show', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.original_name}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${show.original_name}"
/>`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${show.first_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>show Info</h2>
  <ul>
  <li><span class="text-secondary">Number of Episodes:</span> ${
    show.number_of_episodes
  }</li>
  <li><span class="text-secondary">Last Episode To Air:</span> ${
    show.last_episode_to_air.name
  }</li>
  <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>
</div>
  `;

  document.querySelector('#show-details').appendChild(div);
}
 

  //Fetch data from TMDB API
  async function fetchAPIData(endpoint){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();
    
    hideSpinner();
    return data;
}
  //Request  to search
  async function searchAPIData(){
    const API_KEY = global.api.apiKey;
    const API_URL = global.api.apiUrl;
 
    showSpinner();
    const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&page=${global.search.page}&query=${global.search.term}`);

    const data = await response.json();
    
    hideSpinner();
    return data;
}

function showSpinner(){
  document.querySelector('.spinner').classList.add('show');
}
function hideSpinner(){
  document.querySelector('.spinner').classList.remove('show');
}
//Highlight Active links
function highlightActiveLinks(){
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link)=> {
    if(link.getAttribute('href') === global.currentPage){
      link.classList.add('active');
    }
  });
}

//Display Backdrop On Details Pages
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

//Search Movies/Shows
async function search(){
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);

  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  const {results,total_pages, page, total_results} = await searchAPIData();

  const data =  await searchAPIData();
  

  global.search.page = page;
  global.search.totalPages = total_pages;
  global.search.totalResults = total_results;



  if(global.search.term !== '' && global.search.term !== null){
     if(results.length === 0){
      showAlert('No result found');
      return;
     }
     displayResults(results);
     
     
  }else{
    showAlert('please enter search term');
  }
}

//Display search results
function displayResults(results){

  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((type =>{
    const div = document.createElement('div');
    div.classList.add('card');

    if(global.search.type === 'movie'){
         div.innerHTML = ` <a href="movie-details.html?id=${type.id}">
         ${
         type.poster_path
         ? ` <img
         src="https://image.tmdb.org/t/p/w500${type.poster_path}"
         class="card-img-top"
         alt="${type.title}"
       />`: `<img
       src="images/no-image.jpg"
       class="card-img-top"
       alt="${type.title}/>`
         }
       </a>
       <div class="card-body">
         <h5 class="card-title">${type.title}</h5>
         <p class="card-text">
           <small class="text-muted">Aired: ${type.release_date}</small>
         </p>
       </div>`;
       document.querySelector('#search-results-heading').innerHTML = `<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}`;
       document.querySelector('#search-results').appendChild(div);
    }else{
         div.innerHTML = ` <a href="tv-details.html?id=${type.id}">
         ${
         type.poster_path
         ? ` <img
         src="https://image.tmdb.org/t/p/w500${type.poster_path}"
         class="card-img-top"
         alt="${type.original_name}"
       />`: `<img
       src="images/no-image.jpg"
       class="card-img-top"
       alt="${type.original_name}/>`
         }
       </a>
       <div class="card-body">
         <h5 class="card-title">${type.original_name}</h5>
         <p class="card-text">
           <small class="text-muted">Aired: ${type.first_air_date}</small>
         </p>
       </div>`; 
       document.querySelector('#search-results-heading').innerHTML = `<h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}`;
       document.querySelector('#search-results').appendChild(div);
    }   
    }));

    displayPagination();

}

//Create and display pagination for search
function displayPagination(){
  const div = document.createElement('div');
  div.classList.add('pagination');

  div.innerHTML = 
  `<button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>`;

  document.querySelector('#pagination').appendChild(div);

  //Disable prev if we are on first page
  if(global.search.page === 1){
    document.querySelector('#prev').disabled = true;
  }
  //Disable Next if we are on the last page
  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled = true;
  }
  //Display next result
  document.querySelector('#next').addEventListener('click', async ()=>{
    global.search.page++; 
    const {results, total_pages, pages} = await searchAPIData();
    displayResults(results); 
  });
      
     //Display prev result
     document.querySelector('#prev').addEventListener('click', async ()=>{
      global.search.page--; 
      const {results, total_pages, pages} = await searchAPIData();
      displayResults(results); 
    });
    

}
   




function showAlert (message, className = 'error'){
  const div = document.createElement('div');
  div.classList.add('alert',className);
  div.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(div);
  
  setTimeout(() => {
    div.remove();
  }, 3000);
}
//Display silder
async function displaySlider(){
  const {results} = await fetchAPIData('movie/now_playing');
  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
    </h4>
  `;

  document.querySelector('.swiper-wrapper').appendChild(div);

  initSwiper();
  })
}
function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 2,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: true,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

//Adds comms to numbers
function addCommasToNumbers(numbers) {
  return numbers.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//To initilize functions 
function init(){
  switch(global.currentPage){
    case '/':
    case '/index.html': 
    displaySlider(); 
    displayPopularMovies();
      break;
    case '/movie-details.html':
      displayMovieDetails();
      break;
     case '/shows.html':
      displayPopularShows();
      break;    
    case '/tv-details.html':
      displayShowDetails();
      break; 
    case '/search.html':
     search();
      break;    
  }

  highlightActiveLinks();
}
document.addEventListener('DOMContentLoaded',init);