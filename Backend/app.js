// Configuration of environment variables
import dotenv from 'dotenv';
dotenv.config();

// Express setup
import express from 'express';
const app = express();
import session from 'express-session';

// Database connection
import connectToDb from './Database/connect.js'
connectToDb();

//Routes
import userRoutes from './routes/user.routes.js'
import projectRoutes from './routes/project.routes.js'
import expenseRoutes from './routes/expense.routes.js'
import incomeRoutes from './routes/income.routes.js'

import cookieParser from 'cookie-parser';
import cors from 'cors';
import MongoStore from 'connect-mongo';

// ✅ Step 1: Fix CORS (Place this BEFORE session middleware)
app.use(cors({
    origin: ["https://fintrack-bwr9.onrender.com"], // ✅ Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allows cookies
}));

// ✅ Step 2: Use MongoDB for Session Storage
app.use(session({
    secret: process.env.SESSION_KEY, // ✅ Use strong secret
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_CONNECTION, // ✅ Store sessions in MongoDB
        collectionName: "sessions",
    }),
    cookie: {
        httpOnly: true,  
        secure: true, // ✅ Render uses HTTPS (important)
        sameSite: "none", // ✅ Needed for cross-site cookies
    }
}));

// ✅ Step 3: Apply Body Parsers After Session Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Step 4: Register Routes
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/incomes', incomeRoutes);

// ✅ Step 5: Test Route to Check Sessions
app.get("/api/test-session", (req, res) => {
    req.session.test = "Session is working!";
    res.json({ message: "Session set", session: req.session });
});

app.get("/", (req, res) => {
    res.send("Hello from FinTrack Backend!");
});

export default app;
