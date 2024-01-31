const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secret = "ronit9664";

dotenv.config({path: './config.env'}); 

const app = express();
app.use(cors())
const PORT = process.env.PORT || 3001; 


require('./db/conn.js'); // connect to database


// User schema
const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true},
  email: {type: String, required: true},
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.json());

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach user information to the request object
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Example route for the dashboard
app.get('/Dashboard', verifyToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





                        //_______________Sign up__________________


app.post('/api/SignUp', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already exists");
    }

    // Hash the password before saving to the database
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const newUser = new User({ fullname, email, password: hashedPassword });
    await newUser.save(); 

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});






                            //_______________Login__________________


app.post('/api/Login' , async (req, res) => {
    const { email, password } = req.body;

  try {
    // Check if the user with the provided email exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: user._id, fullname: user.fullname, email: user.email }, secret, { expiresIn: '30d' });
    res.status(200).json({ token, userId: user._id, expiresIn: '30d' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})








// Start server 
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
