const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const uri = "mongodb://naveentanikonda577_db_user:Loki%40vit123@ac-hsshkwb-shard-00-00.eb094kr.mongodb.net:27017,ac-hsshkwb-shard-00-01.eb094kr.mongodb.net:27017,ac-hsshkwb-shard-00-02.eb094kr.mongodb.net:27017/?ssl=true&replicaSet=atlas-kklgax-shard-0&authSource=admin";

const client = new MongoClient(uri);

let db;

async function connectDB() {
    try {
        await client.connect();
        db = client.db("student_notes");
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
    }
}

connectDB();


// 1️⃣ ADD NOTE
app.post("/notes", async (req, res) => {

    const note = {
        title: req.body.title,
        subject: req.body.subject,
        description: req.body.description,
        created_date: new Date()
    };

    const result = await db.collection("notes").insertOne(note);

    res.json(result);
});


// 2️⃣ VIEW NOTES
app.get("/notes", async (req, res) => {

    const notes = await db.collection("notes").find().toArray();

    res.json(notes);
});


// 3️⃣ UPDATE NOTE
app.put("/notes/:id", async (req, res) => {

    const id = req.params.id;

    const result = await db.collection("notes").updateOne(
        { _id: new ObjectId(id) },
        {
            $set: {
                title: req.body.title,
                description: req.body.description
            }
        }
    );

    res.json(result);
});


// 4️⃣ DELETE NOTE
app.delete("/notes/:id", async (req, res) => {

    const id = req.params.id;

    const result = await db.collection("notes").deleteOne({
        _id: new ObjectId(id)
    });

    res.json(result);
});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});