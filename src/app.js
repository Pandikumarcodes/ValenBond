const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const PORT = 7498;
const User = require("./models/user");

app.post("/signup", async (req, res) => {
  const newUser = new User({
    firstName: "Pandi",
    lastName: "Selvam",
    emailId: "pandi@example.com",
    password: "secure123",
    age: 23,
    gender: "Male",
  });
  try {
    await newUser.save();
    res.send("data posted");
  } catch (err) {
    res.status(400).send("error", err.message);
  }
});

connectDB()
  .then(() => {
    console.log("✅ Database connection established");
    app.listen(PORT, () => {
      console.log(`server is sucussfully listining running ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });
