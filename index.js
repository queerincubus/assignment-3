const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

// Schema (keeps flexibility for Assignment 2 → 3 migration)
const householdSchema = new mongoose.Schema({}, { strict: false });

// IMPORTANT: Make sure collection name matches MongoDB exactly
const Household = mongoose.model(
  "Household",
  householdSchema,
  "householdsCollection"
);

// Better MongoDB connection handling
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const server = http.createServer(async (req, res) => {

      // Allow CORS (helps debugging on Render/browser)
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Content-Type", "application/json");

      // Home route
      if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        return res.end("Organization website is running");
      }

      // API route (handles /api and /api/)
      if ((req.url === "/api" || req.url === "/api/") && req.method === "GET") {
        try {
          // .lean() ensures clean JSON output INCLUDING _id
          const data = await Household.find({}).lean();

          return res.writeHead(200).end(JSON.stringify({
            count: data.length,
            data: data
          }));

        } catch (err) {
          return res.writeHead(500).end(JSON.stringify({
            error: err.message
          }));
        }
      }

      // 404 fallback
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Route not found");
    });

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port " + PORT);
    });

  })
  .catch(err => {
    console.error("MongoDB connection failed:", err.message);
  });
