const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Task = require('./models/task'); // Import your Task model
const passport = require('./passport-auth/passport');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const generateToken = require('./passport-auth/auth');
const isLoggedIn = require('./utils/isLoggedIn');
const handleAsyncErr = require('./utils/catchError');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

dotenv.config();
const mongoURI = process.env.MONGODB_URL;
const connectDB = async () => {
  // Use environment variable for MongoDB connection string


  if (!mongoURI) {
    throw new Error("MongoDB connection string is not defined in environment variables");
  }

  try {
    await mongoose.connect(`${mongoURI}`)
    console.log("Connection to MongoDB established successfully");
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error(error);
  }
};

// Call the connectDB function to establish the connection
connectDB();

// CORS setup
const corsOptions = {
  origin: '*', // Replace with your client's origin if needed
  optionsSuccessStatus: 200, // For legacy browsers
};

const app = express();
app.use(passport.initialize());
app.use(cookieParser());
app.use(cors(corsOptions));

// To parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// To parse incoming JSON in POST request body
app.use(express.json());


// create task

app.post('/api/user/signup', async (req, res) => {
  try {
    const { username, password } = req.body
    const existingUser = await User.findOne({ Username: username })
    if (existingUser) {
      return res.json({ message: "User already exists" })
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      Username: username,
      Password: hashedPassword
    })
    await newUser.save();
    const token = await generateToken(newUser)
    const Username = newUser.Username
    return res.json({ message: "User registered successfully", token, Username })
  } catch (error) {
    console.log(error);
  }
});

//sign in
app.post('/api/user/signin', async (req, res) => {
  try {
    const { username, password } = req.body
    const existingUser = await User.findOne({ Username: username })

    if (!existingUser) {
      return res.json({ message: "invalid username" })
    }
    const PasswordMatch = await bcrypt.compare(password, existingUser.Password)
    if (PasswordMatch) {
      const token = await generateToken(existingUser)
      const Username = existingUser.Username
      return res.json({ message: "User signed in successfully", token, Username })
    } else {
      return res.json({ message: "invalid password" })
    }
  } catch (error) {
    console.log(error);
  }
});

//create task
app.post('/api/task/create', isLoggedIn, handleAsyncErr(async (req, res) => {
  try {
    const { task } = req.body
    const newTask = new Task({
      author: req.user._id,
      task: task
    })
    await newTask.save()
    res.json({ message: 'Task added successfully' })

  } catch (error) {
    console.log('error occured while adding task', error)

  }
}));

//show all tasks by user
app.get('/api/task/:username/list', isLoggedIn, handleAsyncErr(async (req, res) => {
  try {
    const { username } = req.params
    const foundUser = await User.findOne({ Username: username })
    const userTasks = await Task.find({ author: foundUser._id })

    return res.json({ userTasks })

  } catch (error) {
    console.log('error occured while adding task', error)

  }
}));

//get task by id
app.get('/api/task/:id', handleAsyncErr(async (req, res) => {
  const { id } = req.params
  const foundTask = await Task.findById(id)
  res.json({ message: 'Task has been found', foundTask })
}))

//edit
app.put('/api/task/:id/update', isLoggedIn, handleAsyncErr(async (req, res) => {
  try {
    const { id } = req.params
    const { task } = req.body
    const userTask = await Task.findById(id)

    // conso(userTask.author === req.user._id)
    if (userTask.author.equals(req.user._id)) {
      const updatedTask = await Task.findByIdAndUpdate({ _id: id }, { task: task })
      return (
        res.json({ message: 'Task updated successfully', updatedTask })
      )
    } else {
      res.json({ message: 'unauthorized' })
    }

  } catch (error) {
    console.log(error)
  }

}));

// delete user tak
app.delete('/api/task/:id/delete', isLoggedIn, handleAsyncErr(async (req, res) => {
  try {
    const { id } = req.params
    const userTask = await Task.findById(id)
    if (userTask.author.equals(req.user._id)) {
      await Task.findByIdAndDelete({ _id: id })
      res.json({ message: 'Task has been deleted' })
    } else {
      res.json({ message: 'unauthorized' })
    }

  } catch (error) {
    console.log(error)
  }

}));



// Start your server
const PORT = process.env.PORT || 4000;
const VERCEL_URL = process.env.VERCEL_URL || `http://localhost:${PORT}`;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
