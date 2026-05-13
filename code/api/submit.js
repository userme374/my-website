import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

// cache connection (VERY IMPORTANT for Vercel)
let client;
let clientPromise;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const client = await clientPromise;

    const db = client.db("mydb");
    const collection = db.collection("users");

    const data = req.body;

    await collection.insertOne(data);

    return res.status(200).json({
      success: true,
      message: "Data saved successfully ✅"
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error saving data ❌"
    });
  }
}