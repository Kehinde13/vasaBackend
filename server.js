import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import path from 'path';

import authRoutes from './src/routes/authRoutes.js';
import clientRoute from './src/routes/clients.js';
import vaClientRoutes from './src/routes/vaClients.js';
import documentsRoutes from './src/routes/documents.js';
import invoiceRoutes from './src/routes/invoice.js';
import projectRoutes from './src/routes/projects.js';
import dailyPlanRoutes from './src/routes/dailyPlan.js';

dotenv.config();
connectDB();

const app = express();

// ✅ Move CORS config to the top, before any middleware
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
  credentials: true, 
}));

// ✅ Allow preflight (OPTIONS) requests for all routes
app.options('*', cors());

// ✅ Then use bodyParser
app.use(bodyParser.json());

// ✅ Your API routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoute);
app.use('/api/va-clients', vaClientRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/daily-plans', dailyPlanRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));


// ✅ Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Client Management API');
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
