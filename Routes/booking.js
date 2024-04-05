import express from 'express'
import { getCheckoutSession } from '../Controllers/bookingController.js';

const router = express.Router()

router.post('/checkout-session/:doctorId/:userId', getCheckoutSession)

export default router;