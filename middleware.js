module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "Login required to create new post.");
    return res.redirect("/login");
  }
  next();
};
