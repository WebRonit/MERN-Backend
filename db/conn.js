const mongoose = require('mongoose');
const uri = process.env.DATABASE; // Replace with your local MongoDB URI and database name

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to local MongoDB using Mongoose!');
});
