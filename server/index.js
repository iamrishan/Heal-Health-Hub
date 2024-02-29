const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const connectToMongoDB = require("./db");
require("dotenv").config();
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

app.use(cors());
app.use(express.json());
connectToMongoDB();

//----------------------------- MODELS-------------------------------------------

//USER SCHEMA
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  verified: { type: Boolean, required: true },
  document: { type: String },
});
const User = mongoose.model("User", userSchema);

// ITEM SCHEMA
const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  group: { type: String },
  quantity: { type: Number },
  contactNumber: { type: String, required: true },
  place: { type: String, required: true },
});
const Item = mongoose.model("Item", itemSchema);

//----------------------------- API-------------------------------------------

// SERVER HOME
app.get("/", (req, res) => {
  res.status(200).send(`Server is live`);
});

// REGISTER API
const storage = new GridFsStorage({
  url: process.env.MONGO_DB_URL,
  file: (req, file) => {
    return {
      bucketName: "uploads", // Use your desired bucket name
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

app.post("/register", async (req, res) => {
  const { name, location, email, password, role, verified, documentUrl } =
    req.body;

  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create a new user if not exists
    const newUser = new User({
      name,
      location,
      email,
      password,
      role,
      verified,
      documentUrl,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email exists
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      // Authentication failed
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.verified) {
      // User is not verified
      return res.status(403).json({ message: "User not verified" });
    }

    // Create a JWT token
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h", // Token expires in 1 hour, you can adjust this as needed
      }
    );

    console.log("Server Response:", { token, role: user.role });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ADDITEM API
app.post("/additem", async (req, res) => {
  const { itemName, group, quantity, contactNumber, place } = req.body;

  try {
    const newItem = new Item({
      itemName,
      group,
      quantity,
      contactNumber,
      place,
    });

    // Save the item to the database
    await newItem.save();

    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GETITEMS API
app.get("/getitems", async (req, res) => {
  try {
    const items = await Item.find();

    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// GET UNVERIFIED NEEDERS API
app.get("/getunverifiedneeder", async (req, res) => {
  try {
    // Retrieve all unverified needers from the database
    const unverifiedNeeders = await User.find({
      role: "needer",
      verified: false,
    });

    res.status(200).json(unverifiedNeeders);
  } catch (error) {
    console.error("Error fetching unverified needers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ACCEPT NEEDER API
app.put("/acceptneeder/:id", async (req, res) => {
  const neederId = req.params.id;

  try {
    // Update the user status to verified
    await User.findByIdAndUpdate(neederId, { verified: true });

    res.status(200).json({ message: "Needer accepted successfully" });
  } catch (error) {
    console.error("Error accepting needer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// REJECT NEEDER API
app.delete("/rejectneeder/:id", async (req, res) => {
  const neederId = req.params.id;

  try {
    // Delete the user
    await User.findByIdAndDelete(neederId);

    res.status(200).json({ message: "Needer rejected successfully" });
  } catch (error) {
    console.error("Error rejecting needer:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is running at http://localhost:${process.env.PORT || 3000}`
  );
});
