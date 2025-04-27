const API_KEY = '5b8f641a3427e8cbf2ccf7ca592e66f1';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem = null;

// Get season number
const seasonNumber = document.getElementById('season-picker').value;

// Fetch episodes
async function fetchEpisodes(id, season) {
  const res = await fetch(${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY});
  const data = await res.json();
  return data.episodes;
}

// Fetch trending movies
async function fetchTrending(type) {
  const res = await fetch(${BASE_URL}/trending/${type}/day?api_key=${API_KEY});
  const data = await res.json();
  return data.results;
}

// Fetch trending anime
async function fetchTrendingAnime() {
  const res = await fetch(${BASE_URL}/trending/tv/day?api_key=${API_KEY});
  const data = await res.json();
  const anime = data.results.filter(item => item.origin_country.includes('JP'));
  return anime;
}

// Fetch trending KDrama
async function fetchTrendingKDrama() {
  const res = await fetch(${BASE_URL}/trending/tv/day?api_key=${API_KEY});
  const data = await res.json();
  const kdrama = data.results.filter(item => item.origin_country.includes('KR'));
  return kdrama;
}

// Fetch by genre
async function fetchByGenre(genreId) {
  const res = await fetch(${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId});
  const data = await res.json();
  return data.results;
}

// Display banner
function displayBanner(item) {
  const banner = document.getElementById('banner');
  banner.style.backgroundImage = url(${IMG_URL}${item.backdrop_path});
  banner.innerHTML = 
    <h1>${item.title}</h1>
    <p>${item.overview}</p>
  ;
}

// Display list
function displayList(items, listId) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  items.forEach(item => {
    const poster = document.createElement('img');
    poster.src = ${IMG_URL}${item.poster_path};
    poster.alt = item.title;
    poster.onclick = () => showDetails(item);
    list.appendChild(poster);
  });
}

// Show details
function showDetails(item) {
  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  const modalContent = document.getElementById('modal-content');
  modalContent.innerHTML = 
    <h1>${item.title}</h1>
    <p>${item.overview}</p>
  ;
  changeServer();
}

// Toggle episode description open/close
function toggleEpisode(header) {
  const body = header.nextElementSibling;
  body.style.display = body.style.display === 'block' ? 'none' : 'block';
  const icon = header.querySelector('.toggle-icon');
  icon.textContent = body.style.display === 'block' ? '-' : '+';
}

// Change server (embed player)
let currentServerIndex = 0;
const servers = [
  "vidsrc.me",
  "Player.Videasy.net",
  "vidsrc.xyz",
  // Add more servers here
];

function changeServer() {
  const server = servers[currentServerIndex];
  const type = currentItem.media_type === 'movie' ? 'movie' : 'tv';
  document.getElementById('modal-video').src = https://${server}/embed/${type}/${currentItem.id};
  currentServerIndex = (currentServerIndex + 1) % servers.length;
}

// Close modal
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
