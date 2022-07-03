import express from "express"
import cors from "cors"
import chalk from "chalk"
import dotenv from "dotenv"
import {LogIn, SignUp} from "./controllers/userController.js"
import {Debit, Credit} from "./controllers/movementController.js"

const app = express();


app.use(cors());
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT


app.post('/signup', SignUp)
app.post('/login', LogIn)

// HANDLES CREDIT AND DEBIT
app.post('/credit', Credit)

app.post('/debit', Debit)



app.listen(PORT, () => {
    console.log(chalk.bold.blue('SERVER_UP'));
  });
