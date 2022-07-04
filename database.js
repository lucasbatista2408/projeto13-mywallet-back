import { MongoClient } from "mongodb"
import dotenv from "dotenv"


dotenv.config();

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
let db;

try{
    await client.connect()
    db = client.db('mW_api')
    console.log('conectado')
} catch(err){
    console.log(err)
}

export default db