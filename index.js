const mongoose = require("mongoose");
const initData = require("./init/data.js");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = initData.data.map((obj) => ({
    ...obj,
    owner: "6916cfc6790186cf10527369", // keep your owner id
  }));

  await Listing.insertMany(updatedData);
  console.log("Database Initialized Successfully!");
};

initDB();
