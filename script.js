const movieApp = {
    api_key: '3058422e0d59745070d03d9b781c0d40',
    resultClear: true
};

let pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let current = 0;


let keyHandler = function (event) {
	if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
		current = 0;
		return;
	}
	current++;
	if (pattern.length === current) {
		current = 0;
        window.location.href = "seth.html" 
	}
};
document.addEventListener('keydown', keyHandler, false); {
}










movieApp.displayMovie = function(listOfMovies){
    $('.result').empty()
    listOfMovies.forEach(function(movie){
            const moviePoster = $('<img>').attr('src',`https://image.tmdb.org/t/p/w300/${movie.poster_path}`);
            const title = $('<h2>').text(movie.title)
            const overview = $('<p>').text(movie.overview);
            const releaseYear = $('<p>').text(`Release Date: ${movie.release_date}`)
            const voteAverage = $('<p>').text(`IMDB Voter Avg Score: ${movie.vote_average}`);
            const movieTitleOverview = $('<div>').addClass('text-styling').append(title, overview, releaseYear, voteAverage)
            const appendToHtml = $('<div>').addClass('movie-details').append(moviePoster, movieTitleOverview)
            $('.result').append(appendToHtml)
    })
}


movieApp.movieData = function (language, genre, startDate,endDate, voteAverageLow, voteAverageHigh){ 
    $.ajax('https://api.themoviedb.org/3/discover/movie?',{
        method:"GET",
        dataType:'json',
        data:{
            api_key:movieApp.api_key,
            with_original_language: language,
            with_genres: genre,
            'primary_release_date.gte': startDate,
            'primary_release_date.lte': endDate,
            'vote_average.lte': voteAverageHigh,
            'vote_average.gte': voteAverageLow,

        }
    }).then(function(result){
        let currentDate = new Date()
        let currentTime = currentDate.getTime()
        result.results.filter(function(item){
            let itemDate = new Date(item.release_date)
            console.log(itemDate.getTime())
            let itemTime = itemDate.getTime() 
            itemTime <= currentTime
        }) 
        console.log(currentTime)
        
        function shuffle(array){
            for (let i = array.length - 1; i > 0; i--){
                let j = Math.floor(Math.random()* (i + 1))
                let item = array[i]
                array[i] = array[j]
                array[j] = item
            }
        }
        shuffle(result.results)
        
        // console.log(randomProperty(result.results))
        movieApp.displayMovie(result.results.slice(0,10))



        // console(result.results[0]releaseDate)

        //get a array of movies that meets the standards
    })
}
//the thing is I cannot come up with way that allow me find multiple year at a time


movieApp.userInput = function(){
    $('button').on('click', function (event) {
        event.preventDefault();
        const userInput = $('form').serializeArray();
        const language = userInput[0].value
        const genre = userInput[1].value
        const startDate = `${userInput[2].value}-01-01`
        const endDate = `${Number(userInput[2].value) + 10}-12-31`
        const voteAverageLow = (userInput[3].value)
        const voteAverageHigh = Number(voteAverageLow) + 0.9
        movieApp.movieData(language, genre, startDate,endDate, voteAverageLow, voteAverageHigh)
        console.log(voteAverageLow, voteAverageHigh)
    })
}
movieApp.init = function(){
    movieApp.userInput()
}

//document ready
$(function(){
    movieApp.init();
})








/*
-https://api.openbrewerydb.org/breweries?by_city=Alameda&brewery_type=micro
-this works, this api allows us use multiple filters at the same time
-use ajax to retrieve data. probably use multiple q to get data 
-if array.length > 5
    random get 5
-else 
    return all 

ul.append()


*/