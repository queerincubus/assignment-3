// https://assignment-3-6uyf.onrender.com/

const http = require("http");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const householdSchema = new mongoose.Schema({}, { strict: false });

const Household = mongoose.model(
  "Household",
  householdSchema,
  "householdsCollection"
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    const server = http.createServer(async (req, res) => {

      if (req.url === "/" && req.method === "GET") {
        const filePath = path.join(__dirname, "index.html");

        fs.readFile(filePath, (err, content) => {
          if (err) {
            res.writeHead(500);
            return res.end("Error loading index.html");
          }

          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(content);
        });
        return;
      }

      if (req.url === "/api" && req.method === "GET") {
        try {
          const data = await Household.find({}).lean();

          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify(data));

        } catch (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({ error: err.message }));
        }
      }

      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Route not found");
    });

    const PORT = process.env.PORT || 3000;

    server.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port " + PORT);
    });

mongoose.connection.once("open", async () => {
  console.log("Connected to DB:", mongoose.connection.name);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
});
    
  })
  .catch(err => console.error(err));
