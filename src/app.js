const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const PORT = 7498;
const User = require("./models/user");

app.use(express.json());

//Post api
app.post("/signup", async (req, res) => {
  const newUser = new User(req.body);
  console.log(newUser);
  try {
    await newUser.save();
    res.send("data posted");
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});

// get api by emal
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

//Update Id
app.patch("/users/:userId", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  console.log(data);
  try {
    const Allowed_Updates = ["photoUrl", "gender", "age", "skills", "emailId"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      Allowed_Updates.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not Allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log("user");
    res.send("user updated successfully");
  } catch (err) {
    res.status(400).send("error", err.message);
  }
});

// Delete Api
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const users = await User.findByIdAndDelete(userId);
    console.log("deleted");
    res.send(users);
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
