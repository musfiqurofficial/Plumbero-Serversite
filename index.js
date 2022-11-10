const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nj6duvr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {
    try {
        const serviceCollection = client.db("plumberoDB").collection("plumberoService");
        const reviewCollection = client.db("plumberoDB").collection("reviews");


        app.get('/services/home', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services)
        })

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.post('/addService', async (req, res) => {
            const review = req.body;
            const result = await serviceCollection.insertOne(review);
            res.send(result);
        })

        // app.get('/addService', async (req, res) => {
        //     const query = {};
        //     const cursor = serviceCollection.find(query);
        //     const reviews = await cursor.toArray();
        //     res.send(reviews)
        // })

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        })

        // app.get('/reviews', async (req, res) => {
        //     const decoded = req.decoded;
        //     console.log(decoded);
        //     if (decoded.email !== req.query.email) {
        //         res.status(403).send({ message: 'unauthorized access' })
        //     }
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             email: req.query.email
        //         }
        //     }
        //     const cursor = reviewCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders)
        // })

        // app.patch('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const status = req.body.status;
        //     const query = { _id: ObjectId(id) }
        //     const updateDoc = {
        //         $set: {
        //             status: status
        //         }
        //     }
        //     const result = await reviewCollection.updateOne(query, updateDoc);
        //     res.send(result);
        // })

        // app.delete('/reviews/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await reviewCollection.deleteOne(query);
        //     res.send(result);
        // })

    } finally {

    }
};
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send("Hello Express!")
})

app.listen(port, () => {
    console.log(`Plumbero server running on ${port}!`);
})