module.exports = (req, res, renderTemplate) => {
    if (req.isAuthenticated()){
        renderTemplate(res, req, "profile.ejs");
     }else{
        res.redirect("/signup");
    }
};