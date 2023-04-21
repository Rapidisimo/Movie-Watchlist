
const searchField = document.querySelector('.search-bar input')
const searchButton = document.querySelector('form')
const movieResults = document.querySelector('.results')
const moreResults = document.getElementById('more-results')
let currentSearch = ''
let pageNumber = 1


function omdbSearch(searchText, pageNumber) { //Step 2 - Use the API to perform a general search
    fetch(`https://www.omdbapi.com/?apikey=90353081&s=${searchText}&page=${pageNumber}`)
    .then( response => response.json() )
    .then( data => {
        if(data.Search) {
            omdbTitleSearch(data) //With the resulting data call function to search with titles
            console.log(data)
            console.log(`Search Results for Page: ${pageNumber}`)    
        }else {
            if(moreResults.classList.contains('hidden')) {
                console.log('Is this coming up?')
                movieResults.innerHTML = `
                    <section class="movie-not-found">
                        <h2>Unable to find ${currentSearch}</h2>
                        <p>Please check for any typos.</p>
                    </section>
                `    
            } else {
                moreResults.innerText = 'No Results Left'
                moreResults.disabled = true    
            }
        }
    })
    .catch(error => console.log(error))
}

function omdbTitleSearch(searchData) { //Step 3 - Do another search but with titles to get more data properties
    let searchResults
    let movieSearchTitles = []
    searchResults = searchData.Search //To access Array of search results
    searchResults.forEach( function(movies) { //Make an array with movie titles from the first search
        movieSearchTitles.push(movies.Title)
    })
    
    let groupOfMovies = []
    movieSearchTitles.forEach( movieData => { //Step 4 - Search using the array of movie titles
        fetch(`https://www.omdbapi.com/?apikey=90353081&t=${movieData}`)
        .then( response => response.json() )
        .then( data => {
            groupOfMovies.push(data) //Creat an array of the results
            buildResults(data)
        })
    })


    function buildResults(data) { // Step 5 - Make HTML from search with titles but exclude bad results
        console.log(data)
        Object.assign(this, data)
        const {Ratings, Poster, Title, Runtime, Genre, Plot} = this;
        const imdbRating = Ratings.length > 0 ? Ratings[0].Value.slice(0,3) : 'N/A'; //Filter out errors when there's no ratings
        if(data.Response !== 'False') {
            movieResults.innerHTML += `
                <section class="movie">
                    <div class="poster">
                        <img src="${Poster}" alt="movie-poster">
                    </div>
                    <div class="movie-info">
                        <h2>${Title} <span class="rating-score">⭐️${imdbRating}</span></h2>
                        <div class="movie-details">
                            <p>${Runtime}</p>
                            <p>${Genre}</p>
                            <button class="watch-list-btn" data-title="${Title}">Watchlist</button>
                        </div>
                        <div class="plot">
                            <p class="expand-text">${Plot}</p>
                            <button class="read-more">Read More</button>
                        </div>    
                    </div>
                </section>
            `;
            const expandText = document.querySelectorAll('.read-more')//Expand or constrain plot text
            expandText.forEach( (plot) => {
                plot.addEventListener('click', (e) => {
                    let clicked = e.target.previousElementSibling;
                    if(clicked.classList.contains('expand-text')) {
                        clicked.classList.toggle('expand-text')
                        e.target.innerText = "Read Less"
                    }else if(!clicked.classList.contains('expand-text')) {
                        clicked.classList.toggle('expand-text')
                        e.target.innerText = "Read More"
                    }
                })
            })
        }

        const addToWatchList = document.querySelectorAll('.watch-list-btn');
        addToWatchList.forEach( (wlBtn) => {
            wlBtn.addEventListener('click', (e) => {
                let addMovie = e.target.dataset.title;
                if(!localStorage.getItem('Watchlist')) {
                    localStorage.setItem('Watchlist', JSON.stringify(addMovie))
                }else if (localStorage.getItem('Watchlist')) {
                    let currentStorage = localStorage.getItem('Watchlist');
                    let retrievedStorage = JSON.parse(currentStorage);
                    let myMovies = [];
                    myMovies.push(retrievedStorage, addMovie)
                    localStorage.setItem('Watchlist', JSON.stringify(myMovies))
                }
                // const currenWatchlist = localStorage.getItem("movies") ? null : localStorage.setItem("movies");
                // let currentStorage = JSON.parse(currenWatchlist);
                // if(!currentStorage === addMovie) {
                //     let movieArray = [];
                //     movieArray.push(currentStorage, addMovieString)
                // } else {console.log(HMMMMMM)}

                // // localStorage.setItem("Watchlist", movie)
                // // console.log(localStorage.getItem("Watchlist"))
                
                // // var testObject = { 'one': 1, 'two': 2, 'three': 3 };

                // // Put the object into storage
                // localStorage.setItem('testObject', JSON.stringify(testObject));

                // // Retrieve the object from storage
                // var retrievedObject = localStorage.getItem('testObject');

                // console.log('retrievedObject: ', JSON.parse(retrievedObject));
            })
        })

        if(moreResults.classList.contains('hidden')) { //enable More Results Btn when search is performed
            moreResults.classList.toggle('hidden')
        }
    }
}

/*** Event Listeners ***/

//Step - Optional (More Results)
moreResults.addEventListener('click', () => {//Provide more results through button
        pageNumber++
        omdbSearch(currentSearch, pageNumber)
})

//Step 1 - Search Submission
searchButton.addEventListener('submit', (e) => {
    e.preventDefault()
    moreResults.classList.contains("hidden") ? null : moreResults.classList.add("hidden")//hide the More Results Btn when starting new searches
    moreResults.innerText = 'More Results' //Reset text for More Results Btn
    moreResults.disabled = false //Re-enable button if pervious search reached the end
    pageNumber = 1 //Page needs to be 1 for new searches
    movieSearchTitles = [] //Erase previous search queries titles
    currentSearch = searchField.value //Saved search text to use with "More Results Btn"
    omdbSearch(searchField.value, pageNumber) //Perform a search using the API 
    searchField.value = null //Clear search field
    movieResults.innerHTML = '' //Clear HTML from Previous Results
})

