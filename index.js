
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    const token = jwt.sign({ userId: user._id, email: user.email }, 'R@n!tDUtt@JWT989', { expiresIn: '1h' });

    // Send the token in the response
    res.status(200).json({ token, userId: user._id, expiresIn: 3600 }); // expiresIn is in seconds (1 hour in this example)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})








// Start server 
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
