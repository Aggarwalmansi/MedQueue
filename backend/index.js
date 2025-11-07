const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const auth = require('./routes/auth');
const hospitalRoutes = require('./routes/hospital');
const bedRoutes = require('./routes/bed');
dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

console.log(PORT)

app.use(cors());
app.use(express.json());

app.use("/api/auth", auth)
app.use("/api/hospitals", hospitalRoutes)
app.use("/api/beds", bedRoutes)

app.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" })
})


app.get('/',(req,res)=>{
    res.send('Welcome to the Hospital Management System API');
})

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  })
})


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

