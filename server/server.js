const express = require('express');
const dotenv = require('dotenv')
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const mongoConnect = require("./mongoConnection");
dotenv.config();

const app = express();
mongoConnect();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173/",
    Credential: true,
  })
);

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/ticket", ticketRoutes);


app.listen(process.env.PORT,()=>console.log(`server started at PORT:${process.env.PORT}`))