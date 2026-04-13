// YOUR DEPLOYED URL: https://your-app-url.com

const http = require("http");
const mongoose = require("mongoose");
require("dotenv").config();

const householdSchema = new mongoose.Schema({}, { strict: false });

const Household = mongoose.model(
  "Household",
  householdSchema,
  "householdsCollection"
);
// connect first
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    // start server ONLY after DB connects
    const server = http.createServer(async (req, res) => {

      if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Organization website is running");
      }

      else if (req.url === "/api" && req.method === "GET") {
        try {
          const data = await Household.find();

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));

        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: err.message }));
        }
      }

      else {
        res.writeHead(404);
        res.end("Not found");
      }

    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log("Server running on port " + PORT);
    });

  })
  .catch(err => {
    console.log("MongoDB connection failed:", err);
  });
