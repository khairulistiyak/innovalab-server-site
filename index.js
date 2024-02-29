const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1pit7hr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const reviewCollection = client.db("innovate").collection("review");
    const servicesCollection = client.db("innovate").collection("services");
    const cartsCollection = client.db("innovate").collection("carts");
    const usersCollection = client.db("innovate").collection("users");

    // jwt
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
      console.log(req.body);
      res.send({ token });
    });
    // app.post("/users", async (res, req) => {
    //   const user = req.body;
    //   // const query = { email: user.email };
    //   const result = await usersCollection.insertOne(user);
    //   console.log(user);
    //   res.send(result);
    // });
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ massage: "user already exists" });
      }
      const result = await usersCollection.insertOne(user);
      console.log(user);
      res.send(result);
    });
    // review api
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      // console.log(result);
      res.send(result);
    });
    // services api

    app.get("/services", async (req, res) => {
      const result = await servicesCollection.find().toArray();
      res.send(result);
    });
    // carts api
    app.get("/carts", async (req, res) => {
      const result = await cartsCollection.find().toArray();
      res.send(result);
    });
    app.post("/carts", async (req, res) => {
      const item = req.body;
      const result = await cartsCollection.insertOne(item);
      console.log(item);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("innovalab server running ");
});

app.listen(port, () => {
  console.log(`innova server running on port ${port}`);
});
