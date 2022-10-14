const path = require("path");

const express = require("express");
const expressHandleBars = require("express-handlebars");

const jsonReader = require("./helpers/JSONReader");
const homeRoute = require("./routes/HomePageRoute");
const articlesRoute = require("./routes/ArticlesPageRoute");
const aboutMeRoute = require('./routes/AboutMePageRoute');

const server = express();

server.use(express.static(path.resolve(__dirname, "public")));

server.engine(
  "hbs",
  expressHandleBars.engine({
    extname: "hbs",
    layoutsDir: path.resolve(__dirname, "views", "layouts"),
    partialsDir: path.resolve(__dirname, "views", "partials"),
    defaultLayout: "html",
  })
);
server.set("view engine", "hbs");
server.set("views", path.resolve(__dirname, "views"));

server.use(async (req, res, next) => {
  const menu = await jsonReader("menu.json");

  menu.forEach((data) => {
    if (data.href === req.url) data.currentPage = true;
    else data.currentPage = false;
  });

  res.renderConfig = { menu };

  next();
});

server.use(homeRoute);
server.use(articlesRoute);
server.use(aboutMeRoute);

server.use((req, res) => {
  res.renderConfig.notFound = true;
  res.renderConfig.title = "page not found"

  res.render("404", res.renderConfig);
});

server.listen(process.env.PORT || 3000);
