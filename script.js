/*"use-strict";

//API Links and Keys section
const API_KEY = "1ceaae3c5ffb40daa18484892ca3f265";
const url = "https://newsapi.org/v2/everything?q=";

//Async call url section
async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();

  // Bind function call
  bindData(data.articles);
  // console.log(data);
}

// ---Bind function---
// Bind all data with array given API
function bindData(articles) {
  //Initialization
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    //For cloning use cloneNode() function
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  //Initialize all the ID
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDescription = cardClone.querySelector("#news-desc");

  //Add to article
  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDescription.innerHTML = article.description;

  // Change Date formate (Time zone format (TZ Format))
  //Source-- Stack overflow
  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  // Date Proper way to initialize
  newsSource.innerHTML = `${article.source.name} . ${date}`;

  //While clicking the card open the real NEWS page!
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// For design the active nav
//Get the Nav selected Data NEWS function
let currentSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = navItem;
  currentSelectedNav.classList.add("active");
}

// Search Button Handel
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-Text");

//Click to search
searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  currentSelectedNav?.classList.remove("active");
});

// Enter to Search
searchText.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevent form submission if within a form
    const query = searchText.value.trim();
    if (!query) return;
    fetchNews(query);
    currentSelectedNav?.classList.remove("active");
  }
});

//---Reload the page----
const myLogo = document.getElementById("my-logo");
function reload() {
  window.location.reload();
}
myLogo.addEventListener("click", function () {
  reload("my-logo");
});

//DOM LOAD Event
window.addEventListener("load", () => fetchNews("india"));
*/

("use strict");
// API Links and Keys section
const API_KEY = "1ceaae3c5ffb40daa18484892ca3f265";
const BASE_URL = "https://newsapi.org/v2/everything";

// Fetch news articles asynchronously
const fetchNews = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${query}&apiKey=${API_KEY}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const { articles } = await response.json();
    if (!articles || articles.length === 0) {
      throw new Error("No articles found");
    }

    bindData(articles);
  } catch (error) {
    console.error("Failed to fetch news:", error.message);
    showErrorMessage(error.message);
  }
};

// Bind articles to the DOM
const bindData = (articles) => {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  // Clear previous articles
  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
};

// Fill data into the card
const fillDataInCard = (cardClone, article) => {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDescription = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.textContent = article.title;
  newsDescription.textContent = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.textContent = `${article.source.name} • ${date}`;

  // Open the article in a new tab
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
};

// Handle navigation item clicks
let currentSelectedNav = null;
const onNavItemClick = (id) => {
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = navItem;
  currentSelectedNav.classList.add("active");
};

// Handle search button clicks
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-Text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (query) fetchNews(query);
  currentSelectedNav?.classList.remove("active");
});

searchText.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = searchText.value.trim();
    if (query) fetchNews(query);
    currentSelectedNav?.classList.remove("active");
  }
});

// Reload the page on logo click
document.getElementById("my-logo").addEventListener("click", () => {
  window.location.reload();
});

// Display error messages in the UI
const showErrorMessage = (message) => {
  const cardsContainer = document.getElementById("cards-container");
  cardsContainer.innerHTML = `
    <div class="error-message">
      <p>${message}</p>
    </div>
  `;
};

// Fetch default news on DOM load
window.addEventListener("load", () => fetchNews("india"));
