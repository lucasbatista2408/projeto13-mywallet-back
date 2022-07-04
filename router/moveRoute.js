import express from "express"
import {Debit, Credit, Balance} from "../controllers/movementController.js"

const router = express.Router();

router.post('/credit', Credit)
router.post('/debit', Debit)
router.get('/balance', Balance)

export default router;