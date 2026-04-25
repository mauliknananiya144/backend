const app = require("./app");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const DATABASE_URL = process.env.DATABASE_URL;
app.get("/", (req, res) => {
  res.send("Api is Running");
});

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
  });

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
