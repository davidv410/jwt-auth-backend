import express from "express";
import { getUser, login, logout, refresh, register } from "./auth.controller.js";
import { protect } from "../../middleware/protect.js";

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', protect, logout)
router.get('/user', protect, getUser)

export default router