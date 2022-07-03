import express from "express"
import cors from "cors"
import chalk from "chalk"
import dotenv from "dotenv"
import {LogIn, SignUp} from "./controllers/userController.js"

const app = express();


app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT


app.post('/signUp', SignUp)
app.post('/login', LogIn)


//HANDLES SIGN UP
// app.post('/signUp', async (req, res) => {
//     const newUser = req.body;
//     console.log(newUser);

//     try{
//         await db.collection('users').insertOne(newUser);
//         res.status(201).send('created')
//     } catch(err){
//         console.log(err)
//     }
// })

// app.get('/signUp', async (req, res) => {
//     const usersArr = await db.collection('users').find().toArray()
//     console.log(usersArr)
//     res.send(usersArr)
// })

// //HANDLES LOG IN
// app.post('/logIn', async (req, res) => {
//     const user = req.body;
//     console.log(user)
//     const found = await db.collection('users').findOne({user: user.user, password: user.password})
//     console.log(found)

//     if(!found){
//        return res.sendStatus(404)
//     } else{
//         return res.sendStatus(200)
//     }
// })



app.listen(PORT, () => {
    console.log(chalk.bold.blue('SERVER_UP'));
  });
