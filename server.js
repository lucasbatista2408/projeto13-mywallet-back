import express from "express"
import cors from "cors"
import chalk from "chalk"
import dotenv from "dotenv"
import { MongoClient } from "mongodb"
import db from "./database.js"

const app = express();


app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT

//HANDLES SIGN UP
app.post('/signUp', async (req, res) => {
    const newUser = req.body;
    console.log(newUser);

    try{
        await db.collection('users').insertOne(newUser);
        res.status(201).send('created')
    } catch(err){
        console.log(err)
    }
})

app.get('/signUp', async (req, res) => {
    const usersArr = await db.collection('users').find().toArray()
    console.log(usersArr)
    res.send(usersArr)
})

//HANDLES LOG IN
app.post('/logIn', async (req, res) => {
    const user = req.body;
    console.log(user)
    const found = await db.collection('users').findOne({name: user.user, password: user.password})
    console.log(found)

    if(!found){
       return res.sendStatus(404)
    } else{
        return res.sendStatus(200)
    }
})

// HANDLES CREDIT AND DEBIT
app.post('/credit', async (req, res) => {
    const data = req.body;
    const credit = {
        amount: data.amount,
        description: data.description,
        type: 'credit'
    }
    try{
        await db.collection('credit').inserOne(credit)
        res.sendStatus(201)
    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    
})

app.post('/debit', async (req, res) => {
    const data = req.body;
    const debit = {
        amount: - data.amount,
        description: data.description,
        type: 'debit'
    }
    try{
        await db.collection('debit').inserOne(debit)
        res.sendStatus(201)
    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
    
})



app.listen(PORT, () => {
    console.log(chalk.bold.blue('SERVER_UP'));
  });
