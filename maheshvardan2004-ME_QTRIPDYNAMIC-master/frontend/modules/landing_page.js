import config from "../conf/index.js";

// Entry point
async function init() {
  const cities = await fetchCities();

  if (!cities) return;

  cities.forEach((city) => {
    addCityToDOM(
      city.id,
      city.city,
      city.description,
      city.image
    );
  });
}

// Fetch cities
async function fetchCities() {
  try {
    const response = await fetch(
      `${config.backendEndpoint}/cities`
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return null;
  }
}

// Add city cards
function addCityToDOM(id, city, description, image) {
  const cityCard = `
    <div class="col-12 col-sm-6 col-lg-3 mb-4">
      <a href="pages/adventures/?city=${id}" id="${id}">
        <div class="tile">
          <img src="${image}" alt="${city}" />

          <div class="tile-text">
            <h5>${city}</h5>
            <p>${description}</p>
          </div>
        </div>
      </a>
    </div>
  `;

  document.getElementById("data").innerHTML += cityCard;
}

export { init, fetchCities, addCityToDOM };