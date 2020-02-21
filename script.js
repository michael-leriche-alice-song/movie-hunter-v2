const movieApp = {
    api_key: '3058422e0d59745070d03d9b781c0d40',
    //flag for empty the result div
    resultClear: true
};

//display the movies that meets the user input
movieApp.displayMovie = function(listOfMovies){
    if (Object.keys(listOfMovies).length === 0){
        //alt text if there is no result
        //for screen reader
        const altText = $('<p>').text('Sorry! We cannot find anything!').addClass('visuallyhidden')
        $('.result').append(altText)
        //for sweet alert
        swal({
            imageUrl: 'assets/no-movies.png',
            imageHeight: 300,
            imageAlt: 'There is no matches',
            confirmButtonColor: '#E71D36',
            confirmButtonText: 'Try again',
        })
    } else{
        $('.result').empty()
        listOfMovies.forEach(function(movie){
            //alt image if movie poster image cannot be found
            moviePoster = $('<img>').attr('src', `https://image.tmdb.org/t/p/w300/${movie.poster_path}`).attr('onError', "this.onerror=null;this.src='assets/try-again-later.jpg'");
            //get all the information from the database
            const title = $('<h2>').text(movie.title)
            let overview = ''
            if (movie.overview != ''){
                overview = $('<p>').text(movie.overview);
            }else{
                overview = $('<p>').text('There is no description available for this movie! We are sorry!')
            }
            const releaseYear = $('<p>').text(`Release Date: ${movie.release_date}`)
            const voteAverage = $('<p>').text(`IMDB Voter Avg Score: ${movie.vote_average}`);
            const movieTitleOverview = $('<div>').addClass('text-styling').append(title, overview, releaseYear,voteAverage)
            const appendToHtml = $('<div tabindex="0">').addClass('movie-details').append(moviePoster, movieTitleOverview)
            //show the results
            $('.result').append(appendToHtml)
        })
    }
}

// get the movies from the API
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
        // get rid of the movies that have yet to be released
        let currentDate = new Date()
        let currentTime = currentDate.getTime() - 43200000
        result.results = result.results.filter(function(item){
            let itemDate = new Date(item.release_date)
            let itemTime = itemDate.getTime()
            return itemTime <= currentTime
        }) 
        
        //randomize results
        function shuffle(array){
            for (let i = array.length - 1; i > 0; i--){
                let j = Math.floor(Math.random()* (i + 1))
                let item = array[i]
                array[i] = array[j]
                array[j] = item
            }
        }
        shuffle(result.results)
        //pass the results for displaying
        movieApp.displayMovie(result.results.slice(0,10))
    })
}

movieApp.userInput = function(){
    //when the user click the submit button
    $('button').on('click', function (event) {
        event.preventDefault();
        //get user input from the form
        const userInput = $('form').serializeArray();
        const language = userInput[0].value
        const genre = userInput[1].value
        const startDate = `${userInput[2].value}-01-01`
        const endDate = `${Number(userInput[2].value) + 10}-12-31`
        const voteAverageLow = (userInput[3].value)
        const voteAverageHigh = Number(voteAverageLow) + 0.9
        // send user input to API to match criteria
        movieApp.movieData(language, genre, startDate,endDate, voteAverageLow, voteAverageHigh)
    })
}

movieApp.init = function(){
    movieApp.userInput()
}

//document ready
$(function(){
    movieApp.init();
    //easter egg konami code 
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
})
