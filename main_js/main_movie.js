// ngambil data document bre 
const next = document.getElementById('next')
const prev = document.getElementById('prev')
const div = document.querySelector("#film-container");
const container_prev = document.getElementById('pagination-button')

let page = 1

// link default nya biar lebih gampang kalo mau ubah link utama
let BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40`;

//function utama buat manggil data mainnya (parameternya tinggal di ubah doang biar bisa ambil data lain)
function getdata(bass = BASEURL) { 
     
    baseUrl = bass + `&page=${page}`
    // buat manggil data dari server para meter dari get data
    async function fetchData(mainFetch = baseUrl) {

        // main url belakangnya di tambah sama endpoint
        let BASEURL = `https://api.themoviedb.org/3/${mainFetch}`
        // nampilin data kalo error ya keluar server error kalo dapet datanya bakal return result(array di file.json yang di panggil)
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
            return [];
        }
    }
    
    // create film ini buat bikin tampilan nya bre bisa di sesuaikan dengan kemauan btw parameter nya itu buat index di array
    function createFilmCard(film) {
        return `
        <div class="p-3 rounded-3 m-3" id="column_film_content" onclick="nagivetodetail(${film.id})" style="cursor: pointer;">
                <div class="content-poster">
                <img src="https://image.tmdb.org/t/p/original${film.poster_path}" alt="Poster" width="200px" class="rounded-3">
                <p>${film.overview}</p>
                </div>
                <div class="d-flex flex-column mt-3">
                    <label class="text-center mt-3" style="max-width: 200px;">${film.original_title}</label>
                    <label class="mt-3">${getLastUpdate(film.release_date)}</label>
                    <label class="mt-3">Release: ${film.release_date}</label>
                    <label class="mt-1">Rate: ${film.vote_average}</label>
                    </div>
            </div>
            `;
        }
        
        // nah ini dia akhrinya bakal nampilin hasil sesuai dengan jumlah data yang di terima
        
        async function loadPage() {
            
            const films = await fetchData();

            let search = document.getElementById('searchcontent').value; 
            let info = document.getElementById('result');
            let containerpagination = document.getElementById('conatiner-link')

            document.getElementById('film-container').innerHTML = '';

            films.results.forEach(film => {
                const filmCard = createFilmCard(film); 
                document.getElementById('film-container').insertAdjacentHTML("beforeend", filmCard);
            });
            
            if (search !== '') {
                info.innerHTML = '';
                info.insertAdjacentHTML("beforeend", `${films.total_results} hasil pencarian untuk "${search}"`);
            } else {
                info.innerHTML = ''; 
            }
            console.log(films)

            const limit = 5; 
            let limitPage = limit + page - 1;
            let limitPrev = page - 2; 
            
            if (limitPrev < 1) {
                limitPrev = 1;
            }
            let totalPage 
            films.total_pages > 500 ? totalPage = 500 : totalpage = films.total_pages;
            
            
            
            if (page > 1) {
                for (let i = limitPrev; i < page; i++) {
                    containerpagination.insertAdjacentHTML("beforeend", 
                        `<li class="page-item page-link" onclick="linkpage(${i})" id="main_${i}">${i}</li>`
                    );
                }
            }
            
            for (let i = page; i <= limitPage && i <= totalPage; i++) {
                containerpagination.insertAdjacentHTML("beforeend", 
                    `<li class="page-item page-link ${i === page ? 'active' : ''}" onclick="linkpage(${i})" id="main_${i}">${i}</li>`
                );
            }
            
            if (totalPage > limitPage) {
                containerpagination.insertAdjacentHTML("beforeend", 
                    `<li class="page-item page-link">...</li>`
                );
                containerpagination.insertAdjacentHTML("beforeend", 
                    `<li class="page-item page-link" onclick="linkpage(${totalPage})">${totalPage}</li>`
                );
            }
            
            let statuspage = "main_" + page
            
            document.getElementById(statuspage).style.background = "blue";
            document.getElementById(statuspage).style.color = "white";
            
        
        }
    
    return loadPage();
}


function linkpage(pagecount){
    page = pagecount
    getdata()
    let containerpagination = document.getElementById('conatiner-link')
    containerpagination.innerHTML = ""
}

// buat manggil function pas load data 
window.addEventListener('DOMContentLoaded', function loadalldata(){
    getdata()
    genre()
    language()
}) 

// efek loading (kadang ada kadang engga)
prev.addEventListener('click',function(){
    page--
    div.innerHTML = `
    <div class="container w-100 d-flex justify-content-center">
    <div class="spinner-border spinner-border-light" style="width: 10rem; height: 10rem;" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
    </div>`
    container_prev.style.display = 'none'
    setTimeout(() => {
        
        let containerpagination = document.getElementById('conatiner-link')
        containerpagination.innerHTML = ""
        div.innerHTML = ''
        getdata()
      container_prev.style.display = "block"
    }, 500);
})

// efek loading (kadang ada kadang engga)
next.addEventListener('click',function(){
    page++
    div.innerHTML = `
    <div class="container mb-5 w-100 d-flex justify-content-center">
    <div class="spinner-border spinner-border-light" style="width: 30rem; height: 30rem;margin-bottom: 100px;" role="status">
    <span class="visually-hidden">Loading...</span>
    </div>
    </div>`
    container_prev.style.display = 'none'
    setTimeout(() => {
        div.innerHTML = ''
        getdata()
        let containerpagination = document.getElementById('conatiner-link')
        containerpagination.innerHTML = ""
        container_prev.style.display = 'block'
    }, 500);
})

// fan service buat nampilin last update parameter tanggal film rilis
function getLastUpdate(dateString) {
    // ngambil tanggal sekarang
    const currentDate = new Date();
    // ambil tanggal film rilis 
    const pastDate = new Date(dateString);
    // lalu di kurang 
    const timeDifference = currentDate - pastDate;
    // di itung apakah bisa di hitung per hari bulan atau tahun buat itungnya 
    // rumus hari hasil pembulatan ke bawah dari waktu yang telah di kurangi di bagi 1000 milidetik(1 dtk) di kali 60(1 menit) di kali 60(1 jam) di kali 24(1 hari)  
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    // rumus hari hasil pembulatan ke bawah dari waktu yang telah di kurangi di bagi 30 hari(1 bulan)  
    const monthsDifference = Math.floor(daysDifference / 30); 
    // rumus hari hasil pembulatan ke bawah dari waktu yang telah di kurangi di bagi 365 hari(1 tahun)  
    const yearsDifference = Math.floor(daysDifference / 365);
    
    // kondisi kalo hasil dari tahun lebih dari 1 (terdapat 1 tahun)
    if (yearsDifference >= 1) {
        return `Last update: ${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } 
    // kondisi kalo hasil dari bulan lebih dari 1 (terdapat 1 bulan)
    else if (monthsDifference >= 1) {
        return `Last update: ${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } 
    // sisanya kalo bulan tahun ga dapet hari
    else {
        return `Last update: ${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    }
}

  
// Function to handle search and API request
function search() {
    let search = document.getElementById('searchcontent').value
    // kalo kosong isinya bakal ngereturn yang biasa linknya
    page = 1
    if(search === ""){
        div.innerHTML = ''
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${page}`;
        let containerpagination = document.getElementById('conatiner-link')
        containerpagination.innerHTML = ""
        getdata();
        
    }else{
        // kalo ada isinya di cari trus di kirim endpointnya ke get data trus dari get data bakal di tampilin
        BASEURL = `search/movie?api_key=dd0b318e97369a434228f9f3295faa40&query=${search}`;
        let containerpagination = document.getElementById('conatiner-link')
        containerpagination.innerHTML = ""
        div.innerHTML=''
        getdata()
    }

}
  
// fungsi debounce
const input = document.getElementById('searchcontent')
let timeoutid;

input.addEventListener('input', e =>{
    page = 1
    clearTimeout(timeoutid)
    timeoutid = setTimeout(()=>{
        const data = e.target.value;
        BASEURL = `search/movie?api_key=dd0b318e97369a434228f9f3295faa40&query=${data}`;
        if(data === ""){
            div.innerHTML = ''
            BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${page}`;
            let containerpagination = document.getElementById('conatiner-link')
            containerpagination.innerHTML = ""
            getdata();
        }
        div.innerHTML=''
        let containerpagination = document.getElementById('conatiner-link')
        containerpagination.innerHTML = ""
        getdata()
    },1000)
})

// ini buat ngambil isi genre dari server
function genre(){
    fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=dd0b318e97369a434228f9f3295faa40&id=28')
        .then(respon => respon.json())
        .then(data => {
            const main = data.genres
            main.forEach(coco => {
                const value = 
                `
                   <option class="dropdown-item text-light" value="${coco.id}" id="genre_value">${coco.name}</option>
                `
                document.getElementById('genre_select').insertAdjacentHTML("beforeend", value);
            })
        })
}

// ini buat ambil data bahasa yang ada nanti di filter
function language(){
    fetch('https://api.themoviedb.org/3/configuration/languages?api_key=dd0b318e97369a434228f9f3295faa40')
    .then(response => response.json())
    .then(data => {
        data.forEach(coco => {
            const value = 
            `
               <option class="dropdown-item text-light" value="${coco.iso_639_1}" id="genre_value">${coco.english_name}</option>
            `;
            document.getElementById('lang_select').insertAdjacentHTML("beforeend", value);
        });
    })

}

// buat eksekusi kalo ngefilter lewat bahasa
function filterlang(){
    document.getElementById('searchcontent').value=''; 
    page = 1
    let valuegenre = document.getElementById('lang_select').value;
    BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_original_language=${valuegenre}`;
    div.innerHTML = '';
    let containerpagination = document.getElementById('conatiner-link')
    containerpagination.innerHTML = ""
    getdata()
}

// buat eksekusi kalo ngefilter lewat genre
function filtergenre(){
    document.getElementById('searchcontent').value=''; 
    page = 1
    let valuegenre = document.getElementById('genre_select').value;
    BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&with_genres=${valuegenre}`;
    div.innerHTML = '';
    let containerpagination = document.getElementById('conatiner-link')
    containerpagination.innerHTML = ""
    getdata()

}

// eksekusi kalo sort lewat rate
function sortrate(){
    document.getElementById('searchcontent').value=''; 
    page = 1
    let valuegenre = document.getElementById('rate_sort').value;
    let containerpagination = document.getElementById('conatiner-link')
    containerpagination.innerHTML = ""

    if(valuegenre === "to_high"){
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=1&sort_by=vote_average.asc`;
        div.innerHTML = '';
        getdata()
    }else if(valuegenre === "to_low"){
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=1&sort_by=vote_average.desc`;
        div.innerHTML = '';
        getdata()
    }else{
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${page}`
        div.innerHTML=''
        getdata()
    }

}

// eksekusi kalo sort lewat abjad
function sortabjad(){
    document.getElementById('searchcontent').value=''; 
    page = 1
    let valuegenre = document.getElementById('rate_abjad').value;
    let containerpagination = document.getElementById('conatiner-link')
    containerpagination.innerHTML = ""

    if(valuegenre === "to_high"){
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=1&sort_by=original_title.asc`;
        div.innerHTML = '';
        getdata()
    }else if(valuegenre === "to_low"){
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=1&sort_by=original_title.desc`;
        div.innerHTML = '';
        getdata()
    }else{
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${page}`
        div.innerHTML=''
        getdata()
    }

}

// eksekusi kalo sort lewat tahun
function sortyear(){
    document.getElementById('searchcontent').value=''; 
    page = 1
    let valuegenre = document.getElementById('rate_year').value;
    let containerpagination = document.getElementById('conatiner-link')
    containerpagination.innerHTML = ""

    if(valuegenre === "to_high"){
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=1&sort_by=primary_release_date.asc`;
        div.innerHTML = '';
        getdata()
    }else if(valuegenre === "to_low"){
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=1&sort_by=primary_release_date.desc`;
        div.innerHTML = '';
        getdata()
    }else{
        BASEURL = `discover/movie?api_key=dd0b318e97369a434228f9f3295faa40&page=${page}`
        div.innerHTML=''
        getdata()
    }

}

function nagivetodetail(id){
    window.location.href = `content_zoom.html?id=${id}`;
}



let button = document.getElementById('searchcontent'); 

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' || event.keyCode === 13) {
        search();
    }
});