const express = require("express");
const http = require("http");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator").OpenApiValidator;
const router = require("./routes");
const app = require("./server.js");

// establish mongoose database connection
require("./config/db");

// TODO: serve OpenAPI spec

// install OpenApiValidator
new OpenApiValidator({
  apiSpec: "./schemas/users.yaml",
  validateResponses: true,
  validateRequests: true,
})
  .install(app)
  .then(() => {
    // use defined blog api routes (see routes.js)
    app.use(router);

    // handle express errors
    app.use((err, req, res, next) => {
      console.error("ERROR:", err); // dump error to console for debug
      res.status(err.status || 500).json({
        errors: err.errors,
        message: err.message,
      });
    });
  });

// start express server
const port = process.env.PORT || 3301;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
