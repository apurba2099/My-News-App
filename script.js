"use strict";
// API configuration
const API_KEY = "4f5354d9-bf3f-4413-a451-7a7614e4f281";
const BASE_URL = "https://content.guardianapis.com/search";

// Async function to fetch news
async function fetchNews(query, page = 1) {
  const url = `${BASE_URL}?api-key=${API_KEY}&q=${query}&page=${page}&show-fields=thumbnail,bodyText`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    bindData(data.response.results);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// Bind function to display articles
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    // Skip articles without thumbnails
    if (!article.fields?.thumbnail) return;

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDescription = cardClone.querySelector("#news-desc");

  // Set image and title
  newsImg.src = article.fields.thumbnail;
  newsTitle.innerHTML = article.webTitle;

  // Set description (using bodyText field if available, otherwise use section name)
  newsDescription.innerHTML =
    article.fields?.bodyText?.substring(0, 200) + "..." ||
    `News from ${article.sectionName} section`;

  // Format date
  const date = new Date(article.webPublicationDate).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  // Set source (using section name as source)
  newsSource.innerHTML = `${article.sectionName} · ${date}`;

  // Add click event to open article
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.webUrl, "_blank");
  });
}

// Navigation handling
let currentSelectedNav = null;
let currentPage = 1;

function onNavItemClick(id) {
  currentPage = 1; // Reset page number when changing sections
  fetchNews(id);
  const navItem = document.getElementById(id);
  currentSelectedNav?.classList.remove("active");
  currentSelectedNav = navItem;
  currentSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-Text");

// Click search handler
searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  currentPage = 1; // Reset page when searching
  fetchNews(query);
  currentSelectedNav?.classList.remove("active");
});

// Enter key search handler
searchText.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    const query = searchText.value.trim();
    if (!query) return;
    currentPage = 1; // Reset page when searching
    fetchNews(query);
    currentSelectedNav?.classList.remove("active");
  }
});

// Pagination handlers
currentPage = 1;
const totalPages = 5;
const paginationLinks = document.querySelectorAll(".pagination a");
const prevButton = document.getElementById("btn-prev");
const nextButton = document.getElementById("btn-next");

function getQuery() {
  return searchText.value.trim() || currentSelectedNav?.id || "news";
}

function updatePagination() {
  paginationLinks.forEach((link) => link.classList.remove("active"));
  paginationLinks.forEach((link) => {
    if (parseInt(link.textContent) === currentPage) {
      link.classList.add("active");
    }
  });
}

function loadPage(page) {
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    fetchNews(getQuery(), currentPage);
    updatePagination();
  }
}

prevButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentPage > 1) {
    loadPage(currentPage - 1);
  }
});

nextButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (currentPage < totalPages) {
    loadPage(currentPage + 1);
  }
});

paginationLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const pageNum = parseInt(link.textContent);
    if (!isNaN(pageNum)) {
      loadPage(pageNum);
    }
  });
});
updatePagination();

//Next Page
function loadNextPage() {
  currentPage++;
  const query = searchText.value.trim() || currentSelectedNav?.id || "news";
  fetchNews(query, currentPage);
}
//Previous Page
function loadPreviousPage() {
  if (currentPage > 1) {
    currentPage--;
    const query = searchText.value.trim() || currentSelectedNav?.id || "news";
    fetchNews(query, currentPage);
  }
}

//Add next and previous pagination function events
const nextBtn = document.getElementById("btn-next");
nextBtn.addEventListener("click", function () {
  loadNextPage();
});
const prevBtn = document.getElementById("btn-prev");
prevBtn.addEventListener("click", function () {
  loadPreviousPage();
});

// Logo reload functionality
const myLogo = document.getElementById("my-logo");
function reload() {
  window.location.reload();
}
myLogo.addEventListener("click", reload);

// Initial load
window.addEventListener("load", () => fetchNews("india"));
