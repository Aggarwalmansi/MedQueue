const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const patientRoutes = require('./routes/patient.routes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join_hospital', (hospitalId) => {
    const room = `hospital_${hospitalId}`;
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware to make io available in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true, // Allow cookies to be sent across origins
}));
app.use(express.json());

const session = require('express-session');
app.use(session({
  secret: process.env.SESSION_SECRET || 'banaliya_na',
  resave: true,
  saveUninitialized: true
}));

const passport = require('./middleware/passport');
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/patient", require('./routes/patient.routes')); // Public routes: /hospitals, /bookings
app.use("/api/admin", require('./routes/admin.routes'));
// Hospital routes (Auth handled internally or bypassed for test)
app.use("/api/hospital", authMiddleware, hospitalRoutes);
app.use("/api/search", require('./routes/search.routes'));

app.get("/test", (req, res) => {
  res.json({ message: "Test route is working!" })
});

app.get('/', (req, res) => {
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

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

