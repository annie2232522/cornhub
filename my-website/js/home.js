const API_KEY = '5b8f641a3427e8cbf2ccf7ca592e66f1';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/original';
let currentItem;

/* ================================
   Fetch Functions
================================= */

async function fetchTrending(type) {
  try {
    const res = await fetch(`${BASE_URL}/trending/${type}/week?api_key=${API_KEY}`);
    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return [];
  }
}

async function fetchTrendingAnime() {
  let allResults = [];

  for (let page = 1; page <= 3; page++) {
    try {
      const res = await fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`);
      const data = await res.json();
      const filtered = data.results.filter(item =>
        item.original_language === 'ja' && item.genre_ids
