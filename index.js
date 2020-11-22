const express = require("express");
const app = express();
const path = require("path");
const dataDir = path.resolve(`${process.cwd()}${path.sep}`);
const config = require("./config.js");
const templateDir = path.resolve(`${dataDir}${path.sep}`);
const bodyParser = require("body-parser");
const ejs = require("ejs");
const helmet = require("helmet");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const ejsLayouts = require("express-ejs-layouts");
const Users = require("./models/user.js");
const crypter = require("crypter");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);

mongoose.connect(config.dbUrl, {
  useNewUrlParser: true
});

app.use("/assets", express.static(path.resolve(`${dataDir}${path.sep}assets`)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine("html", ejs.renderFile);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, "/views"));
app.use(helmet());

app.use(session({
  store: new MemoryStore({ checkPeriod: 86400000 }),
  secret: "#@$#^%$@#$%$#^$#%@$#!@#!@",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(ejsLayouts);

passport.serializeUser((user, done) => {
  done(null, user);
});
  
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(new LocalStrategy(async (username, password, done) => {
  if (!username) return done(null, false);
  if (!password) return done(null, false);
  
  const user = await Users.findOne({ username: username });
  if (!user) return done(null, false);
  if (!crypter.validate(user.password, password)) return done(null, false);
  
  return done(null, { username: user.username, id: user.id, email: user.email, seller: user.seller, createdAt: user.createdAt, status: user.status, verified: user.verified, confirmed: user.confirmed, banned: user.banned });
}));

app.get("/login", (req, res) => routeFile("get", "login")(req, res, renderTemplate));
app.post("/login", passport.authenticate("local", { failureRedirect: '/login' }), (req, res) => routeFile("post", "login")(req, res, renderTemplate));
app.get("/signup", (req, res) => routeFile("get", "signup")(req, res, renderTemplate));
app.post("/signup", (req, res) => routeFile("post", "signup")(req, res, renderTemplate));
app.get("/", (req, res) => routeFile("get", "index")(req, res, renderTemplate));
app.get("/profile", (req, res) =>{
  routeFile("get", "profile")(req, res, renderTemplate)
});

app.listen(config.port, null, null, () => console.log("Website is fully running."));

function renderTemplate(res, req, template, data = {}) {
  const baseData = {
    user: req.isAuthenticated() ? req.user : null
  };
  res.render(path.resolve(`${templateDir}/views/${template}`), Object.assign(baseData, data));
};

function routeFile(method, fileName) {
  return require(`./routes/${method}/${fileName}.js`);
}