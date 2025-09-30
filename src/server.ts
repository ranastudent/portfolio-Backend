import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("✅ Portfolio backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
