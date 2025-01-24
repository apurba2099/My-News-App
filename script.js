"use-strict";

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
