const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const { config } = require('dotenv');
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
        const reviewCollection = database.collection('reviews')
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