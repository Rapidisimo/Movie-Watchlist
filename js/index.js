
const searchField = document.querySelector('.search-bar input')
const searchButton = document.querySelector('form')
let movieSearchTitles = []
let movieSearchDetails = []



function omdbSearch(searchText) {
    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=90353081&s=${searchText}`)
    .then( response => response.json() )
    .then( data => {
        console.log(data)
        omdbTitleSearch(data)
    })
}

function omdbTitleSearch(searchData) {
    let searchResults
    searchResults = searchData.Search
    searchResults.forEach( function(movies) {
        movieSearchTitles.push(movies.Title)
    })
    
    for(let i = 0; i < movieSearchTitles.length; i++) {
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=90353081&t=${movieSearchTitles[i]}`)
        .then( response => response.json() )
        .then( data => {
            movieSearchDetails.push(data)
        })
    }
    console.log(movieSearchDetails)
}

searchButton.addEventListener('submit', (e) => {
    e.preventDefault()
    movieSearchTitles = []
    movieSearchDetails = []
    omdbSearch(searchField.value)
    searchField.value = null
})

