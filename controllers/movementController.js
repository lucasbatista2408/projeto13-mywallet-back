import express from "express"
import db from "../database.js"
import joi from "joi";
import { v4 as uuid, validate } from 'uuid';
import dayjs from "dayjs"

const app = express();

app.use(express.json());

export async function Debit(req, res){
    const data = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '')
    console.log(token)

    if(!token) {return res.sendStatus(401)};

    const session = await db.collection("sessions").findOne({token: token})
            
    if (!session) {
        return res.sendStatus(401)
    };

	const user = await db.collection("users").findOne({_id: session.userId})

    const moveSchema = joi.object({
        amount: joi.string().min(1).required(),
        description: joi.string().min(1).required()
    })

    const {error} = moveSchema.validate(data, {abortEarly: false})

    if(error) {return res.status(422).send(error)}

    const newAmount = parseFloat(data.amount.replace(',', '.')).toFixed(2)
    const debit = {
        user: user._id,
        amount: newAmount,
        description: data.description,
        type: 'debit',
        date: dayjs().format('DD/MM'),
        hour:dayjs().format('HH:mm')
    }

    if(!user) return res.status(401)

    try{
        await db.collection('balance').insertOne(debit)
        res.status(201).send(debit)
    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function Credit (req, res){
    const data = req.body;

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '')
    console.log(token)

    if(!token) {return res.sendStatus(401)};

    const session = await db.collection("sessions").findOne({token: token})
            
    if (!session) {
        return res.sendStatus(401)
    };

	const user = await db.collection("users").findOne({_id: session.userId})

    if(!user) return res.status(401)

    const newAmount = parseFloat(data.amount.replace(',', '.')).toFixed(2)

    const moveSchema = joi.object({
        amount: joi.string().min(1).required(),
        description: joi.string().min(1).required()
    })

    const {error} = moveSchema.validate(data, {abortEarly: false})

    if(error){
        return res.status(422).send(error)
    }

    const credit = {
        user: user._id,
        amount: newAmount,
        description: data.description,
        type: 'credit',
        date: dayjs().format('DD/MM'),
        hour: dayjs().format('HH:mm')
    }

    try{
        await db.collection('balance').insertOne(credit)
        res.sendStatus(201)
    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function Balance(req, res){
    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '')
    console.log(token)

    if(!token) {return res.status(401).send('erro no token')};

    const session = await db.collection("sessions").findOne({token: token})
            
    if (!session) {
        return res.status(400).send('sessão não encontrada')
    };

	const user = await db.collection("users").findOne({_id: session.userId})

    if(!user) return res.status(401)

    try{
        const balance = await db.collection('balance').find({user: user._id}).toArray()
        res.status(201).send(balance)
    } catch(err){
        console.log(err)
        return res.send(err)
    }
}