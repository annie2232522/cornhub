const API_KEY = '5b8f641a3427e8cbf2ccf7ca592e66f1';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem;

// Fetch trending movies, shows, or anime
async function fetchTrending(type) {
  const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

// Fetch trending anime (only Japanese TV animation)
async function fetchTrendingAnime() {
  let allResults = [];
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();
    const filtered = data.results.filter(item =>
      item.original_language === 'ja' && item.genre_ids.includes(16)
    );
    allResults = allResults.concat(filtered);
  }
  return allResults;
}

// Display banner
function displayBanner(item) {
  document.getElementById('banner').style.backgroundImage = `url(${IMG_URL}${item.backdrop_path})`;
  document.getElementById('banner-title').textContent = item.title || item.name;
}

// Display list of movies, TV shows, or anime
function displayList(items, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  items.forEach(item => {
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => showDetails(item);
    container.appendChild(img);
  });
}

// Show details in modal
async function showDetails(item) {
  currentItem = item;

  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
  document.getElementById('modal').style.display = 'flex';

  // Clear old episode list
  const episodeList = document.getElementById('episode-list');
  episodeList.innerHTML = '';

  // If TV show, load episodes
  if (item.media_type === 'tv') {
    const episodes = await fetchEpisodes(item.id, 1); // Season 1
    if (episodes.length > 0) {
      const title = document.createElement('h3');
      title.textContent = 'Episodes:';
      episodeList.appendChild(title);

      episodes.forEach(ep => {
        const epDiv = document.createElement('div');
        epDiv.className = 'episode';
        epDiv.innerHTML = `
          <strong>Episode ${ep.episode_number}: ${ep.name}</strong>
          <p>${ep.overview || "No description available."}</p>
        `;
        episodeList.appendChild(epDiv);
      });
    }
  }
}

// Fetch episodes of a TV show season
async function fetchEpisodes(tvId, seasonNumber = 1) {
  try {
    const res = await fetch(`${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`);
    const data = await res.json();
    return data.episodes;
  } catch (error) {
    console.error('Error fetching episodes:', error);
    return [];
  }
}

// Server switcher
function changeServer() {
  const server = document.getElementById('server').value;
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
  let embedURL = "";

  if (server === "vidsrc.cc") {
    embedURL = `https://vidsrc.cc/v2/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.me") {
    embedURL = `https://vidsrc.me/embed/${type}/?tmdb=${currentItem.id}`;
  } else if (server === "player.videasy.net") {
    embedURL = `https://player.videasy.net/${type}/${currentItem.id}`;
  } else if (server === "vidlink.pro") {
    embedURL = `https://vidlink.pro/movie/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.dev") {
    embedURL = `https://vidsrc.dev/embed/movie/${type}/${currentItem.id}`;
  } else if (server === "111movies.com") {
    embedURL = `https://111movies.com/movie/${type}/${currentItem.id}`;
  } else if (server === "vidjoy.pro") {
    embedURL = `https://vidjoy.pro/embed/movie/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.io") {
    embedURL = `https://vidsrc.io/embed/movie/${type}/${currentItem.id}`;
  } else if (server === "www.2embed.cc") {
    embedURL = `https://www.2embed.cc/embed/${type}/${currentItem.id}`;
  } else if (server === "moviesapi.club") {
    embedURL = `https:///moviesapi.club/movie/${type}/${currentItem.id}`;
  } else if (server === "cdn.lbryplayer.xyz") {
    embedURL = `https://cdn.lbryplayer.xyz/embed/${type}/${currentItem.id}`;
  } else if (server === "vidsrc.xyz") {
    embedURL = `https://vidsrc.xyz/embed/${type}/${currentItem.id}`;
  } else if (server === "2anime.xyz") {
    embedURL = `https://2anime.xyz/embed/${type}/${currentItem.id}`;
  }

  document.getElementById('modal-video').src = embedURL;
}

// Close the modal
function closeModal() {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal-video').src = '';
}

// Open search modal
function openSearchModal() {
  document.getElementById('search-modal').style.display = 'flex';
  document.getElementById('search-input').focus();
}

// Close search modal
function closeSearchModal() {
  document.getElementById('search-modal').style.display = 'none';
  document.getElementById('search-results').innerHTML = '';
}

// Search for movies, TV shows, or anime
async function searchTMDB() {
  const query = document.getElementById('search-input').value;
  if (!query.trim()) {
    document.getElementById('search-results').innerHTML = '';
    return;
  }

  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
  const data = await res.json();

  const container = document.getElementById('search-results');
  container.innerHTML = '';
  data.results.forEach(item => {
    if (!item.poster_path) return;
    const img = document.createElement('img');
    img.src = `${IMG_URL}${item.poster_path}`;
    img.alt = item.title || item.name;
    img.onclick = () => {
      closeSearchModal();
      showDetails(item);
    };
    container.appendChild(img);
  });
}

// Initialize page
async function init() {
  const movies = await fetchTrending('movie');
  const tvShows = await fetchTrending('tv');
  const anime = await fetchTrendingAnime();

  displayBanner(movies[Math.floor(Math.random() * movies.length)]);
  displayList(movies, 'movies-list');
  displayList(tvShows, 'tvshows-list');
  displayList(anime, 'anime-list');
}
async function showDetails(item) {
  currentItem = item;

  document.getElementById('modal-title').textContent = item.title || item.name;
  document.getElementById('modal-description').textContent = item.overview;
  document.getElementById('modal-image').src = `${IMG_URL}${item.poster_path}`;
  document.getElementById('modal-rating').innerHTML = '★'.repeat(Math.round(item.vote_average / 2));
  changeServer();
  document.getElementById('modal').style.display = 'flex';

  // Clear old episodes and seasons
  document.getElementById('episode-list').innerHTML = '';
  const seasonPicker = document.getElementById('season-picker');
  seasonPicker.innerHTML = '';

  if (item.media_type === 'tv') {
    document.getElementById('season-picker-container').style.display = 'block'; // show picker
    const show = await fetchShowDetails(item.id);

    show.seasons.forEach(season => {
      if (season.season_number === 0) return; // skip specials
      const option = document.createElement('option');
      option.value = season.season_number;
      option.textContent = `Season ${season.season_number}`;
      seasonPicker.appendChild(option);
    });

    await loadSeasonEpisodes(); // auto load Season 1
  } else {
    document.getElementById('season-picker-container').style.display = 'none'; // hide picker
  }
}

// Fetch all show details (like number of seasons)
async function fetchShowDetails(tvId) {
  const res = await fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`);
  const data = await res.json();
  return data;
}

// Load all episodes based on selected season
async function loadSeasonEpisodes() {
  const seasonNumber = document.getElementById('season-picker').value;
  const episodeList = document.getElementById('episode-list');
  episodeList.innerHTML = '';

  const episodes = await fetchEpisodes(currentItem.id, seasonNumber);
  if (episodes.length > 0) {
    const title = document.createElement('h3');
    title.textContent = `Episodes - Season ${seasonNumber}:`;
    episodeList.appendChild(title);

    episodes.forEach(ep => {
      const epDiv = document.createElement('div');
      epDiv.className = 'episode';
      epDiv.innerHTML = `
        <strong>Episode ${ep.episode_number}: ${ep.name}</strong>
        <p>${ep.overview || "No description available."}</p>
      `;
      episodeList.appendChild(epDiv);
    });
  }
}


init();
