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
        const orderCollection = database.collection('orders');
        const userCollection = database.collection('users')


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
            if (email) {
                const cursor = orderCollection.find({ 'email': email })
                const result = await cursor.toArray();
                res.json(result)
            } else {
                const cursor = orderCollection.find({})
                const result = await cursor.toArray();
                res.json(result)
            }
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

        //API to post a review;
        app.post('/reviews', async (req, res) => {

            const doc = req.body;
            const result = await reviewCollection.insertOne(doc);

            res.json(result)
        })

        //API to post an user information from the registration page into the database;
        app.post('/users', async (req, res) => {

            const doc = req.body;
            const result = await userCollection.insertOne(doc);

            res.json(result)
        })

        //API to check if an google logged in users data is already in the database or not;
        app.put('/users', async (req, res) => {

            const { email, name } = req.body;
            const filter = { email: email }
            const options = { upsert: true }
            const doc = { $set: { email: email, name: name } };

            const result = await userCollection.updateOne(filter, doc, options);

            res.json(result)
        })

        /*-------------------------
         Admin Access API's
         ----------------------- */
        //API for making a new admin for the application;

        app.put('/admin', async (req, res) => {

            const email = req.body.email;
            const filter = { email: email }
            const options = { upsert: false }
            const doc = {
                $set: {
                    role: 'Admin'
                }
            }
            const result = await userCollection.updateOne(filter, doc, options)
        })

        //API for checking if an user is an admin or not;
        app.get('/admin/:email', async (req, res) => {

            const email = req.params.email;
            const query = { email: email };
            let admin = false;
            const result = await userCollection.findOne(query);
            if (result?.role === 'Admin') {
                admin = true;
            }
            res.json(admin)
        })

        //API for setting the status of an order;
        app.put('/orders', async (req, res) => {

            const id = req.body.id;
            const status = req.body.status;

            const filter = { _id: ObjectId(id) }
            const option = { upsert: false }
            const doc = {
                $set: {
                    status: status
                }
            }
            const result = await orderCollection.updateOne(filter, doc, option);
            res.json(result)
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