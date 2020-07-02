const http = require("http");
const path = require("path");
const OpenApiValidator = require("express-openapi-validator").OpenApiValidator;
const router = require("./routes");
const app = require("./server.js");

// establish mongoose database connection
require("./config/db");

// TODO: serve OpenAPI spec
// const spec = path.join(__dirname, "./schemas/users.yaml");
// app.use("/spec", express.static(spec));

// install OpenApiValidator
new OpenApiValidator({
  apiSpec: "./schemas/users.yaml",
  validateResponses: true,
  validateRequests: false,
})
  .install(app)
  .then(() => {
    // Use defined blog api routes (see routes.js)
    app.use(router);
  });

// handle express errors
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

// start express server
const port = process.env.PORT || 3301;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
