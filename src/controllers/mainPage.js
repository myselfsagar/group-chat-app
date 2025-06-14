exports.getHomePage = (req, res) => {
  res.sendFile("home.html", { root: "src/views" });
};
