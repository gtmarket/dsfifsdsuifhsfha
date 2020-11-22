module.exports = (req, res, renderTemplate) => {
    renderTemplate(res, req, "signup.ejs", { alert: null });
};