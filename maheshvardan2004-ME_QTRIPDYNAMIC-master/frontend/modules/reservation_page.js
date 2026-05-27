import config from "../conf/index.js";

//Implementation of fetch call to fetch all reservations
async function fetchReservations() {

  try {

    // Fetch reservations
    const response = await fetch(
      `${config.backendEndpoint}/reservations/`
    );

    // Convert to JSON
    const data = await response.json();

    return data;

  } catch (error) {

    return null;
  }
}

//Function to add reservations to the table
function addReservationToTable(reservations) {

  // No reservations
  if (!reservations || reservations.length === 0) {

    document.getElementById(
      "reservation-table-parent"
    ).style.display = "none";

    document.getElementById(
      "no-reservation-banner"
    ).style.display = "block";

    return;
  }

  // Reservations available
  document.getElementById(
    "reservation-table-parent"
  ).style.display = "block";

  document.getElementById(
    "no-reservation-banner"
  ).style.display = "none";

  // Table body
  const table =
    document.getElementById("reservation-table");

  reservations.forEach((reservation) => {

    // Create row
    const row =
      document.createElement("tr");

    // Format reservation date
    const bookingDate =
      new Date(reservation.date)
        .toLocaleDateString("en-IN");

    // Format reservation time
    let bookingTime =
      new Date(reservation.time)
        .toLocaleString(
          "en-IN",
          {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true,
          }
        );

    // Remove unwanted "at"
    bookingTime =
      bookingTime.replace(" at ", ", ");

    // Add row HTML
    row.innerHTML = `
      <th scope="row">${reservation.id}</th>

      <td>${reservation.name}</td>

      <td>${reservation.adventureName}</td>

      <td>${reservation.person}</td>

      <td>${bookingDate}</td>

      <td>${reservation.price}</td>

      <td>${bookingTime}</td>

      <td>
        <button
          class="reservation-visit-button"
          id="${reservation.id}"
        >
          <a
            href="../detail/?adventure=${reservation.adventure}"
          >
            Visit Adventure
          </a>
        </button>
      </td>
    `;

    // Append row
    table.appendChild(row);
  });
}

export {
  fetchReservations,
  addReservationToTable,
};