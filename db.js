const { MongoClient } = require('mongodb');

// MongoDB ulanish stringi (Atlasdan olingan stringni qo'ying)
const uri = "mongodb+srv://<db_username>:<db_password>@cluster0.ntykqym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB client obyekti
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Ma'lumotlar bazasiga ulanish funktsiyasi
async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB ga muvaffaqiyatli ulanildi");
        
        // Ma'lumotlar bazasi va kolleksiyalarni tanlash
        const db = client.db("habits-app");
        const users = db.collection("users");
        const habits = db.collection("habits");
        const tasks = db.collection("tasks");
        const groups = db.collection("groups");
        
        return { client, db, users, habits, tasks, groups };
    } catch (error) {
        console.error("MongoDB ga ulanishda xatolik:", error);
        process.exit(1);
    }
}

module.exports = { connectDB };