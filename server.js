const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;

// Enable CORS for all requests
app.use(cors());

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load users for authentication
const usersFilePath = path.join(__dirname, "users.json");
const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

// Path to the data and timings file
const dataFilePath = path.join(__dirname, "data.json");
const timingsFilePath = path.join(__dirname, "timings.json");

// Function to read data from JSON file
const readDataFromFile = (filePath) => {
    try {
        const rawData = fs.readFileSync(filePath);
        return JSON.parse(rawData);
    } catch (err) {
        console.error("⚠️ Error reading data file:", err);
        return [];  // Return empty array if file is missing or invalid
    }
};

// Function to write data to JSON file
const writeDataToFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("⚠️ Error writing to data file:", err);
    }
};

// Login Route
app.post("/login", (req, res) => {
    const { username, password, role } = req.body;

    console.log("🔹 Received Login Request:", { username, role });

    let userFound = false;
    let redirectPath = "/";

    if (role === "student") {
        userFound = users.students.some(user => user.username === username && user.password === password);
        redirectPath = "/studentdashboard.html";  
    } else if (role === "staff") {
        userFound = users.staff.some(user => user.username === username && user.password === password);
        redirectPath = "/staffdashboard.html";  
    }

    if (userFound) {
        console.log("✅ Login Successful:", username);
        res.json({ success: true, redirect: redirectPath });
    } else {
        console.log("❌ Invalid Credentials");
        res.json({ success: false, message: "Invalid username or password" });
    }
});

// Upload data from staff page
app.post("/upload", (req, res) => {
    const newData = req.body.data;
    if (!newData) {
        console.error("❌ No data received!");
        return res.status(400).json({ error: "No data provided" });
    }

    const currentData = readDataFromFile(dataFilePath);
    currentData.push(newData);
    writeDataToFile(dataFilePath, currentData);

    console.log("✅ Data uploaded successfully!");
    res.json({ message: "Data uploaded successfully", data: currentData });
});

// Upload timings from staff page
app.post("/upload_timings", (req, res) => {
    const newTimings = req.body.timings;
    if (!newTimings) {
        console.error("❌ No timings data received!");
        return res.status(400).json({ error: "No timings data provided" });
    }

    const currentTimings = readDataFromFile(timingsFilePath);
    currentTimings.push(newTimings);
    writeDataToFile(timingsFilePath, currentTimings);

    console.log("✅ Timings uploaded successfully!");
    res.json({ message: "Timings uploaded successfully", timings: currentTimings });
});

// Get data for student page
app.get("/data", (req, res) => {
    const data = readDataFromFile(dataFilePath);
    res.json(data);
});

// Get timings for student page
app.get("/timings", (req, res) => {
    const timings = readDataFromFile(timingsFilePath);
    res.json(timings);
});

// Catch-all route (default page)
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "page1.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
