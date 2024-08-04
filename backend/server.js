const express = require('express');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const cors = require('cors')


dotenv.config();

// Connection URL
const url = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'passop';
const app = express();
const port = 3000;
app.use(bodyParser.json())
app.use(cors())

client.connect();

// Middleware to parse JSON requests
// app.use(express.json());

// async function connectClient() {
//   try {
//     await client.connect();
//     console.log('Connected successfully to MongoDB');
//   } catch (err) {
//     console.error('Failed to connect to MongoDB', err);
//     process.exit(1);
//   }
// }

// connectClient();

// Get all the passwords
app.get('/', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    // res.status(200).json(findResult);
    res.json(findResult)
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Save a password
app.post('/', async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    // res.status(201).json({ success: true, insertedId: insertResult.insertedId });
    res.send({success:true, result: findResult})
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a password
app.delete('/', async (req, res) => {
  try {
    const password = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne(password);
    // res.status(201).json({ success: true, insertedId: insertResult.insertedId });
    res.send({success:true, result: findResult})
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`);
});

