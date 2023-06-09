const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER
  }:${process.env.DB_PASS}@cluster0.ezafyme.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const classCollection = client.db('expressMusicAcademy').collection('popularClasses');
const instructorCollection = client.db('expressMusicAcademy').collection('popularInstructors');
const classesCollection = client.db('expressMusicAcademy').collection('classes');
const selectedCollection = client.db('expressMusicAcademy').collection('selected');
const usersCollection = client.db('expressMusicAcademy').collection('users');




app.get('/class', async (req, res) => {
  const cursor = classCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get('/instructors', async (req, res) => {
  const cursor = instructorCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})

app.get('/classes', async (req, res) => {
  const cursor = classesCollection.find();
  const result = await cursor.toArray();
  res.send(result);
})


app.get('/selected', async (req, res) => {
  const email = req.query.email;
  if (!email) {
    res.send([]);
  }
  const query = { email: email };
  const result = await selectedCollection.find(query).toArray();
  res.send(result);
})

app.get('/users', async (req, res) => {
  const result = await usersCollection.find().toArray();
  res.send(result);
});

app.post('/selected', async (req, res) => {
  const p = req.body;
  const result = await selectedCollection.insertOne(p);
  res.send(result);
})

app.post('/users', async (req, res) => {
  const user = req.body;
  const query = { email: user.email }
  const existingUser = await usersCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: 'user already existing' })
  }
  const result = await usersCollection.insertOne(user);
  res.send(result);
});

app.delete('/selected/:id', async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await selectedCollection.deleteOne(query);
  res.send(result);
})








async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Express Music Academy Server is updating......!!')
})

app.listen(port, () => {
  console.log(`Express Music Academy Server is running port:${port}`)
})