const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://PandikumarDev:gJtobWMQDDPxdQzN@namastenode.zdwalrt.mongodb.net/divTinder"
  );
};

module.exports = { connectDB };
