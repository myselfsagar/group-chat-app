const notFound = (req, res, next) => {
  res.status(404).sendFile("notFound.html", { root: "src/views" });
};

module.exports = notFound;
