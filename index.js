const express = require("express");
const app = express();

require("./startup/config")(app);
require("./startup/routes")(app);
require("./startup/logger");
require("./startup/database")();
app.get("/", (req, res) => res.send("Hello Mehdi!"));
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
