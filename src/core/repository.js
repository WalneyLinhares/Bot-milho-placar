import { connectDB } from "./mongo.js";

export async function getData() {
    const db = await connectDB();
    const doc = await db.collection("rankings").findOne({ _id: "main" });

    return doc || { placares: {}, lastUpdate: 0 };
}

export async function saveData(data) {
    const db = await connectDB();

    await db.collection("rankings").updateOne(
        { _id: "main" },
        { $set: data },
        { upsert: true }
    );
}