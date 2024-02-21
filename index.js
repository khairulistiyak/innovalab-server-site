const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

app.use(cors());
app.use(express.json());

// innovateLab
// 6igjU2X7ncFThUH4

app.get("/", (req, res) => {
  res.send("innovalab server running ");
});

app.listen(port, () => {
  console.log(`innova server running on port ${port}`);
});
