import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import user from './routes/user';
import auth from './routes/auth';
import cookieParser from 'cookie-parser';
import application from './routes/application';

dotenv.config();

const app: Express = express();

// CORS configuration
const allowedOrigins = [
  'https://participant-web-25-dwgcdgbbd3d4cmd6.norwayeast-01.azurewebsites.net',  // Your frontend URL
  'http://localhost:5173',  // Local development URL
];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);  // Allow the request if the origin is in the allowedOrigins list
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Specify allowed methods
  credentials: true,  // Allow credentials (cookies, etc.)
};


// Use CORS middleware
app.use(cors(corsOptions));

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB connection
const uri: string = process.env.MONGODB_URI || 'mongodb://participant-web-25-server:9KnBdV0x9XR8caPKd4qIk8vsNT7q8PkdsHySm5x62QmKCA72nV8evp6WBL0UIum3LU0eQRIZyYigACDbyAqbvA==@participant-web-25-server.mongo.cosmos.azure.com:10255/participant-web-25-database?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@participant-web-25-server@';
(async () => {
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database');
  } catch (error) {
    console.log('Error connecting to the database', error);
  }
})();

// Routes
app.use('/auth', auth);
app.use('/api', user);
app.use('/api/application', application);

// Health check route
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).send('Server is running');
});

// Start the server
const PORT: string | number = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
