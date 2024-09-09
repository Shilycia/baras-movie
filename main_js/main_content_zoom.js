const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function fetchData(id) {
    let BASEURL = `https://api.themoviedb.org/3/movie/${id}?api_key=dd0b318e97369a434228f9f3295faa40`;
    
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
                    <img src="https://image.tmdb.org/t/p/original${film.poster_path}" alt="">
                </div>
                <div class="about">
                    <h2 style="width: 60%; margin-top: 50px;">${film.original_title}</h2>
                    <p style="margin-top: 30px; width: 90%;">${film.overview}</p>
                    <div class="detail" style="margin-top: 50px;">
                        <label>Rate : ${film.popularity}</label>
                        <br>
                        <label>Genre : 
                            ${film.genres.map(genre => genre.name).join(', ')}
                        </label>
                        <br>
                        <label>Producer : 
                            ${film.production_companies.map(company => company.name).join(', ')}
                        </label>
                        <br>
                        <label>Release : ${film.release_date}</label>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function loadPage() {
    const film = await fetchData(id);

    if (film) {
        const filmCard = createFilmCard(film);
        document.getElementById('body').insertAdjacentHTML('beforeend', filmCard);  // Correctly use insertAdjacentHTML with position
        const noResult = document.getElementById('No_content');
        if (noResult) {
            document.getElementById('body').removeChild(noResult);  // Remove 'No_content' if exists
        }
    }

}

loadPage();
