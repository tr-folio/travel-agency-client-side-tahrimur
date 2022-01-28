const express = require('express');
const app = express();
const {MongoClient} = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb atlas database server connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.budis.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('database connected successfully');

        // GET method for blogs API
        app.get('/read-blogs', async (req, res) => {
            await client.connect();
            console.log('database connected successfully');
            const database = client.db('travel_agency');
            const blogsCollection = database.collection('blogs');
            const result = await blogsCollection.find().toArray();
            res.send(result);
        });

        // GET method for single-blog API
        app.get('/single-blog/:id', async (req, res) => {
            await client.connect();
            console.log('database connected successfully');
            const database = client.db('travel_agency');
            const blogsCollection = database.collection('blogs');
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await blogsCollection.findOne(query);
            res.send(result);
        });

        // POST method for save-user API
        app.post('/save-user', async (req, res) => {
            await client.connect();
            console.log('database connected successfully');
            const user = req.body;
            const database = client.db('travel_agency');
            const usersCollection = database.collection('users');
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server side app running');
});

app.listen(port, () => {
    console.log(`server side app listening at port:${port}`);
});