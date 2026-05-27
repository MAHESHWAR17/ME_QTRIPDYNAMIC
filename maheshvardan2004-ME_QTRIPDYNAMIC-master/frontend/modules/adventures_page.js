import config from "../conf/index.js";

//Implementation to extract city from query params
function getCityFromURL(search) {

  const params = new URLSearchParams(search);

  return params.get("city");
}

//Implementation of fetch call with a parameterized input based on city
async function fetchAdventures(city) {

  try {

    const response = await fetch(
      `${config.backendEndpoint}/adventures?city=${city}`
    );

    const data = await response.json();

    return data;

  } catch (error) {

    return null;
  }
}

//Implementation of DOM manipulation to add adventures
function addAdventureToDOM(adventures) {

  const dataElement = document.getElementById("data");

  // Clear existing cards before adding new ones
  dataElement.innerHTML = "";

  adventures.forEach((adventure) => {

    const card = `
    
      <div class="col-6 col-lg-3 mb-4">

        <a
          href="detail/?adventure=${adventure.id}"
          id="${adventure.id}"
        >

          <div class="activity-card">

            <img
              src="${adventure.image}"
              alt="${adventure.name}"
            />

            <div class="d-flex justify-content-between p-2">
              <h5>${adventure.name}</h5>
              <p>₹${adventure.costPerHead}</p>
            </div>

            <div class="d-flex justify-content-between p-2">
              <p>${adventure.duration} Hours</p>
              <p>${adventure.category}</p>
            </div>

          </div>

        </a>

      </div>
    `;

    dataElement.innerHTML += card;
  });
}

//Implementation of filtering by duration
function filterByDuration(list, low, high) {

  return list.filter((adventure) => {

    return (
      adventure.duration >= low &&
      adventure.duration <= high
    );
  });
}

//Implementation of filtering by category
function filterByCategory(list, categoryList) {

  return list.filter((adventure) => {

    return categoryList.includes(adventure.category);
  });
}

//Implementation of combined filter function
function filterFunction(list, filters) {

  let filteredList = list;

  // No filters applied
  if (
    filters.category.length === 0 &&
    filters.duration === ""
  ) {
    return filteredList;
  }

  // Filter by category
  if (filters.category.length > 0) {

    filteredList = filterByCategory(
      filteredList,
      filters.category
    );
  }

  // Filter by duration
  if (filters.duration !== "") {

    const duration = filters.duration.split("-");

    filteredList = filterByDuration(
      filteredList,
      parseInt(duration[0]),
      parseInt(duration[1])
    );
  }

  return filteredList;
}

//Implementation of localStorage API to save filters
function saveFiltersToLocalStorage(filters) {

  localStorage.setItem(
    "filters",
    JSON.stringify(filters)
  );

  return true;
}

//Implementation of localStorage API to get filters
function getFiltersFromLocalStorage() {

  const filters = localStorage.getItem("filters");

  return JSON.parse(filters);
}

//Implementation of DOM manipulation to add filters
function generateFilterPillsAndUpdateDOM(filters) {

  // Update duration dropdown
  document.getElementById(
    "duration-select"
  ).value = filters.duration;

  // Clear previous category pills
  document.getElementById(
    "category-list"
  ).innerHTML = "";

  // Add category pills
  filters.category.forEach((filter) => {

    const categoryHTML = `
      <div class="category-filter">
        ${filter}
      </div>
    `;

    document.getElementById(
      "category-list"
    ).innerHTML += categoryHTML;
  });
}

export {
  getCityFromURL,
  fetchAdventures,
  addAdventureToDOM,
  filterByDuration,
  filterByCategory,
  filterFunction,
  saveFiltersToLocalStorage,
  getFiltersFromLocalStorage,
  generateFilterPillsAndUpdateDOM,
};