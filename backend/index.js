const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());


app.use(express.json());

app.use("/query", require("./routes/query"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
