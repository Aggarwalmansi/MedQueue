const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');
const authRoutes = require('./routes/auth.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const patientRoutes = require('./routes/patient.routes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

// Initialize Prisma Client
const prisma = new PrismaClient();

// Verify database connection
async function verifyDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log(' Database connected successfully');
  } catch (error) {
    console.error(' Database connection failed:', error.message);
    console.error('Please check your DATABASE_URL environment variable');
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 5001;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://med-queue.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean),
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


app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://med-queue.vercel.app",
      process.env.FRONTEND_URL
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      // For debugging, you might want to log blocked origins
      console.log('Blocked by CORS:', origin);
      // return callback(new Error('Not allowed by CORS')); // Strict mode
      return callback(null, true); // Permissive mode for debugging
    }
    return callback(null, true);
  },
  credentials: true,
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

// Start server after verifying database connection
async function startServer() {
  // Debug logging for environment variables (masked)
  if (process.env.DATABASE_URL) {
    const maskedUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
    console.log(`🔍 Checking DATABASE_URL format: ${maskedUrl}`);
    if (process.env.DATABASE_URL.startsWith("'") || process.env.DATABASE_URL.endsWith("'")) {
      console.error("❌ ERROR: DATABASE_URL has single quotes around it! Please remove them in Render dashboard.");
    }
  }

  await verifyDatabaseConnection();

  server.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`🗄️  Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

