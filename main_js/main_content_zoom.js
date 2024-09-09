const params = new URLSearchParams(window.location.search);
const ids = params.get('id');

// Function to fetch movie details
async function fetchMovieDetails(id = ids) {
    const BASEURL = `https://api.themoviedb.org/3/movie/${id}?api_key=dd0b318e97369a434228f9f3295faa40`;
    
    try {
        const response = await fetch(BASEURL);
        if (response.status === 200) {
            const data = await response.json();
            return data; 
        } else {
            throw new Error("Server Error");
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

// Function to generate movie card
function createFilmCard(film) {
    return `
        <div id="content" class="container-content-detail">
            <div class="banner-film">
                <img src="https://image.tmdb.org/t/p/original${film.backdrop_path}">
                <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
                <div class="title-film">${film.title}</div>
            </div>
            <div class="main-content">
                <div class="poster-film">
                    <img src="https://image.tmdb.org/t/p/original${film.poster_path}" alt="Poster">
                </div>
                <div class="about">
                    <h2>${film.original_title}</h2>
                    <p>${film.overview}</p>
                    <div class="detail">
                        <label>Rate: ${film.popularity}</label><br>
                        <label>Genre: ${film.genres.map(genre => genre.name).join(', ')}</label><br>
                        <label>Producer: ${film.production_companies.map(company => company.name).join(', ')}</label><br>
                        <label>Release: ${film.release_date}</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load movie details and display them
async function loadMovieDetails() {
    const film = await fetchMovieDetails();

    if (film) {
        const filmCard = createFilmCard(film);
        document.getElementById('body').insertAdjacentHTML('beforeend', filmCard);
        const noResult = document.getElementById('No_content');
        if (noResult) {
            document.getElementById('body').removeChild(noResult);
        }
    }
}

loadMovieDetails();

// Variables for pagination
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const div = document.querySelector("#film-container");
const containerPrev = document.getElementById('pagination-button');
let page = 1;

// Function to fetch a list of movies based on genre
async function fetchMoviesByGenre() {
    const BASEURL = `https://api.themoviedb.org/3/discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_genres=${await getGenreFilter()}&page=${page}`;

    try {
        const response = await fetch(BASEURL);
        if (response.status === 200) {
            const data = await response.json();
            return data.results;
        } else {
            throw new Error("Server Error");
        }
    } catch (error) {
        console.log(error);
        return [];
    }
}

// Function to get genre filter (to be used in genre-based movie fetching)
async function getGenreFilter() {
    const film = await fetchMovieDetails(ids);
    return film.genres.map(genre => genre.id).join(',');
}

// Function to generate and display movie cards
function createMovieCard(film) {
    return `
        <div class="p-3 rounded-3 m-3" id="column_film_content" onclick="navigateToDetail(${film.id})" style="cursor: pointer; max-width: 235px;">
            <div class="content-poster">
                <img src="https://image.tmdb.org/t/p/original${film.poster_path}" alt="Poster" width="200px" class="rounded-3">
                <p>${film.overview}</p>
            </div>
            <div class="d-flex flex-column mt-3">
                <label class="text-center mt-3">${film.original_title}</label>
                <label class="mt-3">${getLastUpdate(film.release_date)}</label>
                <label class="mt-3">Release: ${film.release_date}</label>
                <label class="mt-1">Rate: ${film.vote_average}</label>
            </div>
        </div>
    `;
}

// Load movies and display them
async function loadMovies() {
    const films = await fetchMoviesByGenre();

    div.innerHTML = ''; // Clear container before loading new movies
    films.forEach(film => {
        const filmCard = createMovieCard(film);
        div.insertAdjacentHTML("beforeend", filmCard);
    });
}

// Initial load on page load
window.addEventListener('DOMContentLoaded', loadMovies);

// Pagination event listeners
prev.addEventListener('click', function() {
    if (page > 1) {
        page--;
        handlePageLoad();
    }
});

next.addEventListener('click', function() {
    page++;
    handlePageLoad();
});

// Loading spinner with pagination
function handlePageLoad() {
    div.innerHTML = `
        <div class="container w-100 d-flex justify-content-center">
            <div class="spinner-border" style="width: 10rem; height: 10rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>`;
    containerPrev.style.display = 'none';

    setTimeout(() => {
        loadMovies();
        containerPrev.style.display = "block";
    }, 500);
}

// Calculate how long ago the movie was released
function getLastUpdate(dateString) {
    const currentDate = new Date();
    const pastDate = new Date(dateString);
    const timeDifference = currentDate - pastDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const monthsDifference = Math.floor(daysDifference / 30);
    const yearsDifference = Math.floor(daysDifference / 365);

    if (yearsDifference >= 1) {
        return `Last update: ${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } else if (monthsDifference >= 1) {
        return `Last update: ${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else {
        return `Last update: ${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }
}

// Navigate to movie details page
function navigateToDetail(id) {
    window.location.href = `content_zoom.html?id=${id}`;
}
