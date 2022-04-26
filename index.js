const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// Mongo Includes

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.h0a2l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    client.connect()
    const productCollection = client.db("EmaJhon").collection("products")
    app.get("/products", async (req, res) => {
      // jodi onk data ar modda nirdisto data dakate cai taile .limit(dataNumber) baboher korbo
      console.log("request", req.query)
      const page = parseInt(req.query.page);
      const size = parseInt(req.query.size);
      const query = {};
      const cursor = productCollection.find(query)
      let products;
      if (page || size) {
        products = await cursor.skip(page * size).limit(size).toArray()
      }
      else {
        products = await cursor.toArray();
      }
      res.send(products)
    })

    // Count data In database
    app.get("/productCount", async (req, res) => {
      const productCount = await productCollection.estimatedDocumentCount();
      res.send({ productCount })
    })
  }
  finally {
    console.log("every");
  }
}
run().catch(console.dir)




app.get("/", (req, res) => {
  res.send('Start Ema-jhon Bangla desh')
})

app.listen(port, () => {
  console.log('Running Port', port);
})