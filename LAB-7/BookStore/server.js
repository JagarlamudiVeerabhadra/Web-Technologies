const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));

const uri = "mongodb://naveentanikonda577_db_user:Loki%40vit123@ac-hsshkwb-shard-00-00.eb094kr.mongodb.net:27017,ac-hsshkwb-shard-00-01.eb094kr.mongodb.net:27017,ac-hsshkwb-shard-00-02.eb094kr.mongodb.net:27017/?ssl=true&replicaSet=atlas-kklgax-shard-0&authSource=admin";
const client = new MongoClient(uri);

let db;

async function connectDB() {
    await client.connect();
    db = client.db("bookstore");
    console.log("MongoDB connected");
}

connectDB();

app.get("/books/search", async (req, res) => {
    const title = req.query.title;

    const books = await db.collection("books")
        .find({ title: { $regex: title, $options: "i" } })
        .toArray();

    res.json(books);
});

app.get("/books/category/:category", async (req, res) => {

    const books = await db.collection("books")
        .find({ category: req.params.category })
        .toArray();

    res.json(books);
});

app.get("/books/sort/:field", async (req, res) => {

    const field = req.params.field;

    let sortOption = {};

    if (field === "price") sortOption = { price: 1 };
    if (field === "rating") sortOption = { rating: -1 };

    const books = await db.collection("books")
        .find()
        .sort(sortOption)
        .toArray();

    res.json(books);
});

app.get("/books/top", async (req, res) => {

    const books = await db.collection("books")
        .find({ rating: { $gte: 4 } })
        .limit(5)
        .toArray();

    res.json(books);
});

app.get("/books", async (req, res) => {

    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const books = await db.collection("books")
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();

    res.json(books);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});