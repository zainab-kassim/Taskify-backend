const express = require('express');
const passport=require('./passport-auth/passport')
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB=require('./config/database')
const cors=require('./middleware/cors')
const userRoutes=require('./routes/user/user-routes')
const taskRoutes=require('./routes/task/task-routes')

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Call the connectDB function to establish the connection
connectDB();

const app = express();
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors);

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body
app.use(express.json());

//Route for userLogic
app.use('/api/user',userRoutes)

//Route for taskLogic
app.use('/api/task',taskRoutes)


// Start your server
const PORT = process.env.PORT || 4000;
const VERCEL_URL = process.env.VERCEL_URL || `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
