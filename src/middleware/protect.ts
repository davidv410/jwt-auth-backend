import 'dotenv/config'
import type { Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import {AppError} from "../types.js";

export const protect = (req: Request, res: Response, next: NextFunction) => {
    try{
    if(!req.cookies.token){ throw new AppError(401, "Invalid token") }

    const decoded = jwt.verify(req.cookies.token, process.env.ACCESS_TOKEN_SECRET!) as { id: string, role: string, name: string }

    req.user = decoded

    next()
    }catch(err){
        next(err)
    }
}