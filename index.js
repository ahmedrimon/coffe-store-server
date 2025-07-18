const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()

const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// const uri = "mongodb+srv://coffeeStore:U9dp2DUVxwQHB9oA@cluster0.zkmq5nf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zkmq5nf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //Document Raw Copy
    // const database = client.db("sample_mflix");
    
    const coffeeCollection = client.db('coffeeDb')
    const coffee = coffeeCollection.collection('coffee');

    app.get('/coffee', async(req, res) => {
        const cursor = coffee.find();
      const allValues = await cursor.toArray();
      res.send(allValues)
    })

    app.post('/coffee', async(req, res) => {
      const newCoffee = req.body
      console.log(newCoffee)
      //direct copy to mongodb insert document
      const result = await coffee.insertOne(newCoffee);
      res.send(result);
    })

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
  res.send('Hello World! Server Running Successfully')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
