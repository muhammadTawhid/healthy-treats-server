const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port =  5000

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello assignment')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfrum.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("HealthyTreats").collection("Products");

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, items) => {
        res.send(items)
    })
})

  app.post('/addProduct', (req, res) =>{
    const newProduct = req.body;
    console.log('adding new product', newProduct)
    productCollection.insertOne(newProduct)
    .then(result => {
        console.log('inserted count',result.insertedCount)
        res.send(result.insertedCount > 0)
    })
})

app.delete('/delete/:id', (req, res) => {
  const id = ObjectID(req.params.id)
  // console.log('delete this', req.params.id)
  productCollection.findOneAndDelete({_id: id})
  .then(result => {
    console.log(result);
   })
})
//   client.close();
});


app.listen( process.env.PORT || port)
