// const { MongoClient, ServerApiVersion } = require('mongodb');

// const uri = process.env.DATABASE_L;
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

// async function run() {
//   try {
//     await client.connect();
    
//     // Check if the 'users' collection exists
//     const database = client.db('user_info'); // Replace with your actual database name
//     const collections = await database.listCollections({ name: 'users' }).toArray();

//     if (collections.length === 0) {
//       console.error("The 'users' collection does not exist.");
//     } else {
//       console.log("Connection to MongoDB Atlas and 'users' collection successful!");
//     }

//   } finally {
//     await client.close();
//   }
// }

// run().catch(console.dir);

const mongoose = require('mongoose');
const uri = process.env.DATABASE; // Replace with your local MongoDB URI and database name

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to local MongoDB using Mongoose!');
});
