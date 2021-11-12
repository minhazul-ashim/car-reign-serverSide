const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { config } = require('dotenv');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

//Middlewares
app.use(express.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ptzya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect()

        const database = client.db('carReign');
        const carCollection = database.collection('carCollection');
        const reviewCollection = database.collection('reviews');
        const orderCollection = database.collection('orders')


        //API to get the car collection from the database;
        app.get('/cars', async (req, res) => {

            const cursor = carCollection.find({});
            const result = await cursor.toArray();

            res.send(result);
        })

        //API to get the reviews collection from the database;
        app.get('/reviews', async (req, res) => {

            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();

            res.send(result)
        })

        //API to get the specific car information;
        app.get('/carinfo/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) }

            const result = await carCollection.findOne(query);

            res.send(result)
        })

        //API to get the specific orders for a user;
        app.get('/orders', async (req, res) => {

            const email = req.query.email;
            const cursor = orderCollection.find({ 'email': email })
            const result = await cursor.toArray();

            res.json(result)
        })

        //API to add a order into the database;
        app.post('/orders', async (req, res) => {

            const doc = req.body;
            const result = await orderCollection.insertOne(doc);

            res.json(result);
        })
        
        //API to cancel an order;
        app.delete('/orders/:id', async (req, res) => {

            const id = req.params.id;
            const cursor = await orderCollection.deleteOne({ _id: ObjectId(id) })

            res.json(cursor);
        })
    }
    finally {
        // client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {

    res.send('The server is and watching')
})

app.listen(port, () => {

    console.log('The server is working')
})