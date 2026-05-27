const express = require("express");
const cors = require("cors");
const lowDb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const bodyParser = require("body-parser");
const { nanoid, customAlphabet } = require("nanoid");
var dayjs = require("dayjs");

const db = lowDb(new FileSync("db.json"));

const app = express();

const random_data = require("./random_data");

var utc = require("dayjs/plugin/utc");
var timezone = require("dayjs/plugin/timezone");

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Asia/Kolkata");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8082;

/*
GET all cities
*/
app.get("/cities", (req, res) => {
  const data = db.get("cities").value();

  return res.json(data);
});

/*
GET adventures by city
*/
app.get("/adventures", (req, res) => {
  const data = db.get("adventures").value();

  let response = (
    data.find((item) => item.id == req.query.city) || []
  ).adventures;

  if (response) {
    return res.json(response);
  } else {
    return res.status(400).send({
      message: `Adventure not found for ${req.query.city}!`,
    });
  }
});

/*
GET adventure details
*/
app.get("/adventures/detail", (req, res) => {
  const data = db.get("detail").value();

  let response = data.find(
    (item) => item.id == req.query.adventure
  );

  if (response) {
    return res.json(response);
  } else {
    return res.status(400).send({
      message: `Adventure details not found for ${req.query.adventure}!`,
    });
  }
});

/*
Create reservation
*/
app.post("/reservations/new", (req, res) => {
  const reservation = req.body;

  if (
    !(
      reservation.name &&
      reservation.date &&
      reservation.person &&
      reservation.adventure
    )
  ) {
    return res.status(400).send({
      message: `Invalid data received`,
    });
  }

  const instance = db.get("detail").value();

  const nanoid = customAlphabet(
    "1234567890abcdef",
    16
  );

  let reqDate = dayjs(req.body.date);

  let currentDate = dayjs(new Date());

  if (reqDate > currentDate) {
    db.get("detail")
      .find((item) => item.id == req.body.adventure)
      .assign({
        reserved: true,
        available: false,
      })
      .write();

    const costPerHead = instance.find(
      (item) => item.id == req.body.adventure
    ).costPerHead;

    const adventureName = instance.find(
      (item) => item.id == req.body.adventure
    ).name;

    reservation.name = reservation.name
      .trim()
      .toLowerCase()
      .split(" ")
      .map(
        (i) =>
          i.charAt(0).toUpperCase() + i.slice(1)
      )
      .join(" ");

    db.get("reservations")
      .push({
        ...reservation,
        adventureName: adventureName,
        price:
          reservation.person * costPerHead,
        id: nanoid(),
        time: new Date().toString(),
      })
      .write();

    return res.json({ success: true });
  } else {
    return res.status(400).send({
      message:
        "Date of booking is incorrect. Can't book for a past date!",
    });
  }
});

/*
GET reservations
*/
app.get("/reservations", (req, res) => {
  const data = db.get("reservations").value();

  if (data) {
    return res.json(data);
  }
});

/*
Add random adventure
*/
app.post("/adventures/new", (req, res) => {
  let categories = [
    "Beaches",
    "Cycling",
    "Hillside",
    "Party",
  ];

  let places = random_data.places;

  let images_collection = random_data.images;

  let images = [];

  for (var i = 0; i < 3; i++) {
    let index = randomInteger(0, 100);

    images.push(images_collection[index]);
  }

  const city = req.body.city;

  const nanoid = customAlphabet(
    "1234567890",
    10
  );

  const id = nanoid();

  const name =
    places[Math.floor(Math.random() * places.length)];

  const price = randomInteger(500, 5000);

  const adventureDetail = {
    id: id,
    name: name,
    subtitle:
      "This is a mind-blowing randomly generated adventure!",
    images: images,
    content:
      "Random content",
    available: true,
    reserved: false,
    costPerHead: price,
  };

  const adventuresData = {
    id: id,
    name: name,
    costPerHead: price,
    currency: "INR",
    image:
      images[
        Math.floor(Math.random() * images.length)
      ],
    duration: randomInteger(1, 20),
    category:
      categories[
        Math.floor(Math.random() * categories.length)
      ],
  };

  db.get("detail")
    .push(adventureDetail)
    .write();

  let adventures = db
    .get("adventures")
    .find((item) => item.id == city)
    .get("adventures")
    .value();

  adventures.push(adventuresData);

  db.get("adventures")
    .find((item) => item.id == city)
    .assign({ adventures })
    .write();

  res.json({
    success: true,
    ...adventuresData,
  });
});

/*
Start server
*/
app.listen(process.env.PORT || PORT, () => {
  console.log(
    `Backend is running on port ${
      process.env.PORT || PORT
    }`
  );
});

/*
Helper function
*/
function randomInteger(min, max) {
  return (
    Math.floor(Math.random() * (max - min + 1)) +
    min
  );
}