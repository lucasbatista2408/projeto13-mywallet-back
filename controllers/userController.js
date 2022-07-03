import express from "express"
import db from "../database.js"
import joi from "joi";
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';


const token = uuid();
const app = express();

app.use(express.json());

export async function LogIn(req, res){
    const user = await req.body;
    console.log(user)

    const schemaLogIn = joi.object({
      email: joi.string().min(1).email().required(),
      password: joi.string().min(1).required()
  })

  const {error} = schemaLogIn.validate(req.body,{abortEarly: false});

  if (error) {
      return res.status(422).send(error);
  } else{
    const found = await db.collection('users').findOne({email: user.email})
    const comparePass = bcrypt.compareSync(user.password, found.password)

      if(found && comparePass){
        return res.sendStatus(200)
      } else{
        return res.status(404).send("User and/or password does not match")
      }
  }
}

export async function SignUp(req, res){
    const {name, email, password} = req.body;
    console.log(req.body);

    const schemaSignUp = joi.object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      password: joi.string().required(),
      confirm: joi.ref("password") 
  })

  const {error} = schemaSignUp.validate(req.body,{abortEarly: false});

  if (error) {
      return res.status(422).send(error);
  }

  const encrypted = bcrypt.hashSync(password, 10);
  console.log(encrypted)
  const encUser ={ // ENCRYPTED USER
    name,
    email,
    password: encrypted
  }

    try{
        await db.collection('users').insertOne(encUser);
        res.status(201).send('created')
    } catch(err){
        console.log(err)
    }
}