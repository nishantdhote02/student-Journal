const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const journalRoutes = require("./routes/journal.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const searchRoutes = require("./routes/search.routes");
const profileRoutes = require("./routes/profile.routes");
const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin:
      "https://student-journal-frontend-gfjyyzsfp-riyanstake12-9453s-projects.vercel.app",
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/profile", profileRoutes);

module.exports = app;
