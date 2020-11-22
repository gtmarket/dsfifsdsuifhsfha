module.exports = (req, res, renderTemplate) => {
  if (req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.redirect("/login");
  }
};