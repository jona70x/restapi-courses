"use strict";

// load modules
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const { sequelize } = require("./models/index");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

//Importing models
const { User, Course } = require("./models");

//Importing routes
const routes = require("./routes");

// create the Express app
const app = express();
app.use(express.json());
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan("dev"));

// setup a friendly greeting for the root route
app.use("/api", routes);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");

    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get("port"), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
