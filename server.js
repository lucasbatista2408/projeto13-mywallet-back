import express from "express"
import cors from "cors"
import chalk from "chalk"
import dotenv from "dotenv"
import {LogIn, SignUp} from "./controllers/userController.js"
import {Debit, Credit, Balance} from "./controllers/movementController.js"

const app = express();


app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT

//HANDLES SIGNUP AND LOGIN
app.post('/signup', SignUp)
app.post('/login', LogIn)

// HANDLES CREDIT AND DEBIT
app.post('/credit', Credit)
app.post('/debit', Debit)

//HANDLES BALANCE DISPLAY
app.get('/balance', Balance)


app.listen(PORT, () => {
    console.log(chalk.bold.blue('SERVER_UP'));
  });
