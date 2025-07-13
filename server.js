import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './src/routes/clients.js';
import vaClientRoutes from './src/routes/vaClients.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Configure CORS to allow Vercel frontend and include credentials
const allowedOrigins = [
  'http://localhost:3000',
  'https://vasa-eight.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Important if sending cookies or Authorization headers
}));

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/va-clients', vaClientRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Client Management API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
