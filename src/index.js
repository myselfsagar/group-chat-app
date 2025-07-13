const express = require("express");
const app = express();
const http = require("http").createServer(app);
const { init } = require("./socket");

require("dotenv").config();
require("./models/index");
require("./services/archivedMessages");
const mainRoutes = require("./routes/index");
const dbConnect = require("./utils/dbConnect");

const io = init(http);

//middlewares
app.use(express.json());
app.use(express.static("src/public"));
app.use(mainRoutes);

//connect to the server
(async () => {
  try {
    await dbConnect.sync({ force: false });
    const PORT = process.env.PORT || 5000;
    http.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
