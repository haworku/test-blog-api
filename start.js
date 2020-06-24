const app = require("./server.js");

// establish mongoose database connection
require("./config/db");

// start express server
const port = process.env.PORT || 3301;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
