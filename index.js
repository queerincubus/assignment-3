const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

// Schema
const householdSchema = new mongoose.Schema({}, { strict: false });

const Household = mongoose.model(
  "Household",
  householdSchema,
  "householdsCollection"
);

// Connect MongoDB first
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // Create server AFTER DB connects
    const server = http.createServer(async (req, res) => {

      // Home route
      if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("Organization website is running");
      }

      // API route
      else if (req.url === "/api" && req.method === "GET") {
  try {
    const data = await Household.find();

    res.writeHead(200, { "Content-Type": "application/json" });

    return res.end(JSON.stringify({
      count: data.length,
      data: data
    }));

  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: err.message }));
  }
}

      // 404 fallback
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Route not found");
    });

    // IMPORTANT for Render
    const PORT = process.env.PORT || 3000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port " + PORT);
    });

  })
  .catch(err => {
    console.error("MongoDB connection failed:", err);
  });
