const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const PORT = 7498;
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    res.send("data posted");
  } catch (err) {
    res.status(400).send("error", err.message);
  }
});

app.get("/user", async (req, res) => {
  const userEmails = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmails });
    console.log(users);
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("error", err.message);
  }
});

app.get("/users", async (req, res) => {
  const userEmails = req.body.emailId;
  try {
    const users = await User.findOne({ emailId: userEmails });
    console.log(users);
    if (users.length === 0) {
      res.status(404).send("user not found");
    } else {
      res.send(users);
    }
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
