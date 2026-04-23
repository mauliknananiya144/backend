const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Api is Running");
});
let DATABASE_URL = "mongodb://127.0.0.1:27017/maulik-portfolio";
mongoose
  .connect(DATABASE_URL, {})
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
