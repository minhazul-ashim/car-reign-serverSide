const express = require('express');
const cors = require('cors');

const port = process.env.PORT || 5000;
const app = express();



//Middlewares
app.use(express.json())
app.use(cors());


app.get('/', (req, res) => {

    res.send('The server is and watching')
})

app.listen( port, () => {

    console.log('The server is working')
})