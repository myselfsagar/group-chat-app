const express = require("express");
require("dotenv").config();
const mainRoutes = require("./routes/index");
const app = express();

//connect to db
const dbConnect = require("./utils/dbConnect");
require("./models/index");

//middlewares
app.use(express.json());
app.use(express.static("src/public"));

//routes
app.use(mainRoutes);

//connect to the server
(async () => {
  try {
    await dbConnect.sync({ force: false });
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running at ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
