const express = require('express');
const dotenv = require('dotenv')
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const mongoConnect = require("./mongoConnection");
const cookieParser = require("cookie-parser");
const {
  checkAuth,
  checkAuthForAdmin,
} = require("./middlewares/protectedRoutes");
dotenv.config();

const app = express();
mongoConnect();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173/",
    Credential: true,
  })
);

app.use("/user", userRoutes);
app.use("/admin", checkAuthForAdmin, adminRoutes);
app.use("/ticket", checkAuth, ticketRoutes);


app.listen(process.env.PORT,()=>console.log(`server started at PORT:${process.env.PORT}`))