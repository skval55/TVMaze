"use strict";

// https://api.tvmaze.com/search/shows?q=***
//  https://api.tvmaze.com/shows/***/episodes

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  let response = await axios.get(
    `https://api.tvmaze.com/search/shows?q=${term}`
  );
  return response.data;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  let img;
  for (let show of shows) {
    try {
      img = show.show.image.original;
    } catch {
      img = "https://tinyurl.com/missing-tv";
    }
    const $show = $(
      `<div data-show-id="${show.show.id}" class="Show col-md-12 col-lg-6 mb-4">
      <div class="media">
      <img
      src="${img}"
      alt="${show.show.name}"
      class="w-25 mr-3">
      <div class="media-body">
      <h5 class="text-primary">${show.show.name}</h5>
      <div><small>${show.show.summary}</small></div>
      <button class="btn btn-outline-light btn-sm Show-getEpisodes">
      Episodes
      </button>
      </div>
      </div>
      </div>
      `
    );
    $showsList.append($show);
  }
  // gets show id to run getEpisodesOfShow function
  // also i put the click event in this function so when the buttons are added they
  // will get this click event.
  $(".Show-getEpisodes").click(function (e) {
    $("#episodes-list").html("");
    const showId = $(e.target).closest(".Show").data("show-id");
    getEpisodesOfShow(showId);
  });
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(
    `https://api.tvmaze.com/shows/${id}/episodes`
  );
  populateEpisodes(response.data);
}

/** Write a clear docstring for this function... */

// figure out how to clear episodes area before showing more episodes
// clears episodes area and then adds an li to the episodes-list in the correct html format
function populateEpisodes(episodes) {
  $("#episodes-list").innerHTML = "";
  for (let episode of episodes) {
    const $episode = $(
      `<li id="${episode.id}">${episode.name},(season ${episode.season}, episode ${episode.number})</li>`
    );
    $("#episodes-list").append($episode);
  }
  $episodesArea.show();
}
