import config from "../conf/index.js";

//Implementation to extract adventure ID from query params
function getAdventureIdFromURL(search) {

  const params = new URLSearchParams(search);

  return params.get("adventure");
}

//Implementation of fetch call with a parameterized input based on adventure ID
async function fetchAdventureDetails(adventureId) {

  try {

    const response = await fetch(
      `${config.backendEndpoint}/adventures/detail?adventure=${adventureId}`
    );

    const data = await response.json();

    return data;

  } catch (error) {

    return null;
  }
}

//Implementation of DOM manipulation to add adventure details to DOM
function addAdventureDetailsToDOM(adventure) {

  // Add adventure name
  document.getElementById(
    "adventure-name"
  ).textContent = adventure.name;

  // Add subtitle
  document.getElementById(
    "adventure-subtitle"
  ).textContent = adventure.subtitle;

  // Add content
  document.getElementById(
    "adventure-content"
  ).textContent = adventure.content;

  // Add images
  const photoGallery =
    document.getElementById("photo-gallery");

  // Clear existing images
  photoGallery.innerHTML = "";

  adventure.images.forEach((image) => {

    // Create wrapper div
    const imageWrapper =
      document.createElement("div");

    // Create image element
    const imageElement =
      document.createElement("img");

    // Set source
    imageElement.src = image;

    // Add css class
    imageElement.className =
      "activity-card-image";

    // Append image
    imageWrapper.appendChild(imageElement);

    // Append wrapper
    photoGallery.appendChild(imageWrapper);
  });
}

//Implementation of bootstrap gallery component
function addBootstrapPhotoGallery(images) {

  const photoGallery =
    document.getElementById("photo-gallery");

  // Clear existing content
  photoGallery.innerHTML = "";

  let carouselHTML = `
    <div
      id="adventure-carousel"
      class="carousel slide"
      data-bs-ride="carousel"
    >

      <div class="carousel-inner">
  `;

  images.forEach((image, index) => {

    carouselHTML += `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <img
          src="${image}"
          class="d-block w-100"
          alt="Adventure Image"
        />
      </div>
    `;
  });

  carouselHTML += `
      </div>

      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#adventure-carousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon"></span>
      </button>

      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#adventure-carousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon"></span>
      </button>

    </div>
  `;

  photoGallery.innerHTML = carouselHTML;
}

//Implementation of conditional rendering of DOM based on availability
function conditionalRenderingOfReservationPanel(adventure) {

  // If available
  if (adventure.available) {

    // Hide sold out panel
    document.getElementById(
      "reservation-panel-sold-out"
    ).style.display = "none";

    // Show reservation panel
    document.getElementById(
      "reservation-panel-available"
    ).style.display = "block";

    // Update cost per head
    document.getElementById(
      "reservation-person-cost"
    ).textContent = adventure.costPerHead;
  }

  // If sold out
  else {

    // Show sold out panel
    document.getElementById(
      "reservation-panel-sold-out"
    ).style.display = "block";

    // Hide reservation panel
    document.getElementById(
      "reservation-panel-available"
    ).style.display = "none";
  }
}

//Implementation of reservation cost calculation based on persons
function calculateReservationCostAndUpdateDOM(adventure, persons) {

  // Calculate total cost
  const totalCost =
    adventure.costPerHead * persons;

  // Update DOM
  document.getElementById(
    "reservation-cost"
  ).textContent = totalCost;
}

//Implementation of reservation form submission
function captureFormSubmit(adventure) {

  const form =
    document.getElementById("myForm");

  form.addEventListener("submit", async function (event) {

    event.preventDefault();

    const formData = {
      name:
        document.forms["myForm"]["name"]
          ? document.forms["myForm"]["name"].value
          : "",

      date:
        document.forms["myForm"]["date"]
          ? document.forms["myForm"]["date"].value
          : "",

      person:
        document.forms["myForm"]["person"]
          ? document.forms["myForm"]["person"].value
          : "",

      adventure: adventure.id,
    };

    try {

      const response = await fetch(
        `${config.backendEndpoint}/reservations/new`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      // Reservation success
      if (data) {

        alert("Success!");

        window.location.reload();
      }

    } catch (error) {

      alert("Failed!");
    }
  });
}

//Implementation of success banner after reservation
function showBannerIfAlreadyReserved(adventure) {

  // If already reserved
  if (adventure.reserved) {

    document.getElementById(
      "reserved-banner"
    ).style.display = "block";
  }

  // If not reserved
  else {

    document.getElementById(
      "reserved-banner"
    ).style.display = "none";
  }
}

export {
  getAdventureIdFromURL,
  fetchAdventureDetails,
  addAdventureDetailsToDOM,
  addBootstrapPhotoGallery,
  conditionalRenderingOfReservationPanel,
  captureFormSubmit,
  calculateReservationCostAndUpdateDOM,
  showBannerIfAlreadyReserved,
};