
const searchField = document.querySelector('.search-bar input')
const searchButton = document.querySelector('form')



function omdbSearch(searchText) { //Use the API to perform a general search
    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=90353081&s=${searchText}`)
    .then( response => response.json() )
    .then( data => {
        omdbTitleSearch(data)
    })
}

function omdbTitleSearch(searchData) { //Do another search but with titles to get more data
    let searchResults
    let movieSearchTitles = []
    searchResults = searchData.Search
    searchResults.forEach( function(movies) { //Make an array with movie titles
        movieSearchTitles.push(movies.Title)
    })
    
    let groupOfMovies = []
    movieSearchTitles.forEach( movieData => { //Search using the array of movie titles
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=90353081&t=${movieData}`)
        .then( response => response.json() )
        .then( data => {
            groupOfMovies.push(data) //Creat an array of the results
            buildResults(data)
        })
    })

    function buildResults(data) { //Make HTML but exclude bad results
        const movieResults = document.querySelector('.results')
        if(data.Response !== 'False') {
            movieResults.innerHTML += `
            <section class="movie">
                <div class="poster">
                    <img src="${data.Poster}" alt="movie-poster">
                </div>
                <div class="movie-info">
                    <h1>${data.Title}</h1>
                    <div class="movie-details">
                    <p>${data.Runtime}</p>
                    <p>${data.Genre}</p>
                    <button>+ Watchlist</button>
                    </div>
                    <div class="plot">
                        <p>
                        ${data.Plot}
                        </p>
                    </div>    
                </div>
            </section>
        `
        }
    }
}

searchButton.addEventListener('submit', (e) => { //Listen for search queries
    e.preventDefault()
    movieSearchTitles = []
    movieSearchDetails = []
    omdbSearch(searchField.value)
    searchField.value = null
})

