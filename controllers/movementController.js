import express from "express"
import db from "../database.js"
import joi from "joi";
import { v4 as uuid } from 'uuid';

const app = express();

app.use(express.json());

export async function Debit(req, res){
    const data = req.body;
    const debit = {
        amount: - data.amount,
        description: data.description,
        type: 'debit'
    }
    console.log(debit);

    // try{
    //     await db.collection('debit').inserOne(debit)
    //     res.sendStatus(201)
    // } catch(err){
    //     console.log(err)
    //     res.sendStatus(500)
    // }
}

export async function Credit (req, res){
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
}