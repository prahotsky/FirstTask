var searchResult = document.getElementById("searchResult")
var filmsArr = [];
var totalResults;

showFilms(bestFilms);

async function makeRequest() {
    searchResult.removeEventListener("scroll", listenScroll);
    var searchValue = document.getElementById("searchInput").value;
    await fetch("http://www.omdbapi.com/?apikey=1f944386&s=" + searchValue + "&page=" + (filmsArr.length + 1))
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Some problems. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (filmsData) {
                    if (filmsData.Response === "False") {
                        showErr();
                        return;
                    }
                    totalResults = +filmsData.totalResults;
                    filmsArr.push(filmsData.Search);
                    showFilms(filmsData);
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        });
}

function showFilms(filmsData) {
    if (document.getElementById("searchInput").value){
        searchResult.addEventListener("scroll", listenScroll);
    }
    filmsData.Search.forEach(function (item) {
        var resultItem = document.createElement("div");
        resultItem.className = "search-result-item";
        searchResult.appendChild(resultItem);
        var resultItemContainer = document.createElement("div");
        resultItemContainer.className = "result-item-container";
        resultItem.appendChild(resultItemContainer);
        var posterContainer = document.createElement("div");
        posterContainer.className = "result-item-poster";
        resultItemContainer.appendChild(posterContainer);
        var posterImg = document.createElement("img");
        if (item.Poster === "N/A") {
            posterImg.src = "https://ranobehub.org/img/ranobe/posters/default.jpg";
        } else {
            posterImg.src = item.Poster;
        }
        posterImg.className = "poster-img";
        posterContainer.appendChild(posterImg);
        var resultItemCaption = document.createElement("figcaption");
        resultItemCaption.className = "item-caption";
        resultItemCaption.innerHTML = item.Title + "<br>" + item.Year;
        resultItemContainer.appendChild(resultItemCaption);
    })
}

function showErr() {
    var errMsg = document.createElement("div");
    errMsg.className = "err-msg";
    errMsg.innerHTML = "Nothing found"
    searchResult.appendChild(errMsg);
}

function listenScroll(event) {
    var target = event.target;
    if (target.scrollHeight - target.scrollTop < target.scrollHeight / 2 + 20 && totalResults > (filmsArr.length * 10)) {
        makeRequest();
    };
}

document.getElementById("searchForm").addEventListener("submit", formSubmit);

function formSubmit(event) {
    event.preventDefault();
    clearSearchResult();
    if (!document.getElementById("searchInput").value) {
        searchResult.removeEventListener("scroll", listenScroll);
        showFilms(bestFilms);
        return;
    }
    makeRequest();
}

function clearSearchResult() {
    searchResult.innerHTML = "";
    filmsArr = []
}