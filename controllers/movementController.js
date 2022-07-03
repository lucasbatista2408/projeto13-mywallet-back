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

    if(!token) return res.sendStatus(401);

    const session = await db.collections("sessions").findOne({ token });
            
    if (!session) return res.sendStatus(401);

	const user = await db.collections("users").findOne({_id: session.userId})

    const moveSchema = joi.object({
        amount: joi.string().min(1).required(),
        description: joi.string().min(1).required()
    })

    const {error} = moveSchema.validate(data, {abortEarly: false})

    if(error) return res.status(422).send(error)

    const newAmount = parseFloat(data.amount.replace(',', '.')).toFixed(2)
    const debit = {
        amount: newAmount,
        description: data.description,
        type: 'debit',
        date: dayjs().format('DD/MM'),
        hour:dayjs().format('HH:mm')
    }

    try{
        await db.collection('balance').insertOne(debit)
        res.status(201).send('inserted')
    } catch(err){
        console.log(err)
        res.sendStatus(500)
    }
}

export async function Credit (req, res){
    const data = req.body;
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

}