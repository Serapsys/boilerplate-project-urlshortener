require("dotenv").config();
var bodyParser = require("body-parser");
const dns = require("node:dns");
const URL = require("url").URL;
const express = require("express");
const cors = require("cors");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const urlId = 3;
var url = null;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;
  var urlObject;
  try {
    urlObject = new URL(originalUrl);
  } catch (err) {
    res.json({ error: "invalid url" });
  }

  dns.lookup(urlObject.hostname, (err, address, family) => {
    if (err) {
      res.json({ error: "invalid url" });
    } else {
      url = req.body.url;
      res.json({ original_url: req.body.url, short_url: urlId });
    }
  });
});

app.get("/api/shorturl/:short", function (req, res) {
  console.log(":", req.params);
  res.redirect(url);
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
