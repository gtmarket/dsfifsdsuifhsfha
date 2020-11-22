const Users = require("../../models/user.js");
const crypter = require("crypter");

module.exports = async (req, res, renderTemplate) => {
  const emailRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const usernameRegExp = /^[a-zA-Z0-9]+$/;

  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const repeatedPassowrd = req.body["repeat-password"];

  if (!email) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Bad request! No email." });
  if (!username) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Bad request! No username." });
  if (!password) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Bad request! No password." });
  if (!password) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Bad request! No repeated password." });

  if (emailRegExp.test(email) !== true) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Invalid email address." });
  if (username.length < 3) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Username is too short." });
  if (username.length > 13) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Username is too long." });
  if (usernameRegExp.test(username) !== true) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Invalid username! Only simple usernames are allowed." });
  if (password !== repeatedPassowrd) return renderTemplate(res, req, "pages/signup.ejs", { alert: "Passwords doesn't match." });
  
  const isUsername = await Users.find({ username: username });
  if (isUsername.length > 0) return renderTemplate(res, req, "pages/signup.ejs", { alert: "This username is already used by someone else." });

  const isEmail = await Users.find({ email: email });
  if (isEmail.length > 0) return renderTemplate(res, req, "pages/signup.ejs", { alert: "This email is already used by someone else." });

  let allUsers = await Users.countDocuments();

  const newUser = new Users({
    id: allUsers++,
    username: username,
    email: email,
    password: crypter.hash(password),
    seller: null,
    createdAt: Date.now(),
    status: "User",
    verified: false,
    confirmed: false,
    banned: false
  });

  await newUser.save();

  renderTemplate(res, req, "pages/signup.ejs", { alert: "Sucessfully signed up!" });
};