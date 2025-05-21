// Import required modules
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import questionRoutes from './routes/questionRoutes.js';
import optionRoutes from './routes/optionRoutes.js';

// Load environment variables from .env file
dotenv.config();

// Connect to the database
connectDB();

// Initialize Express app
const app = express();

// Set the port from environment or default to 5000
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount question-related routes at /questions
app.use('/questions', questionRoutes);

// Mount option-related routes at /options
app.use('/options', optionRoutes);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
