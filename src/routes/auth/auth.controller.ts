import type { Request, Response, NextFunction } from "express";
import { refreshTokens, users } from "../../db/schema.js";
import { db } from "../../db/db.js";
import bcrypt from 'bcrypt'
import { loginSchema, registerSchema } from "../../validation/schemas.js";
import { AppError } from "../../types.js";
import {AuthService} from "../../services/auth.service.js";
import {eq} from "drizzle-orm";

const authService = new AuthService()

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const parsed = registerSchema.safeParse(req.body)
        if(!parsed.success){ throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid requst body') }
        
        const response = await authService.register(parsed.data)

        res.json(response)
    }catch(err){
        next(err)
    }
}
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const parsed = loginSchema.safeParse(req.body)

        if(!parsed.success){ throw new AppError(400, parsed.error.issues[0]?.message ?? 'Invalid requst body') }

        const response = await authService.login(parsed.data)

        res.cookie('token', response.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000  //1h
        })

        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000  //7d
        })

        res.status(200).json({ user: response.user })

    }catch(err){
        next(err)
    }
}

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const response = await authService.refreshToken(req.cookies.refreshToken)

        res.cookie('token', response.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 60 * 60 * 1000  //1h
        })

        res.cookie('refreshToken', response.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000  //7d
        })

        res.status(200).json({ message: "Tokens generated" })
    }catch(err){
        next(err)
    }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try{
        if(!req.user){ throw new AppError(404, 'No user') }

        await db.update(refreshTokens).set({ revokedAt: new Date() }).where(eq(refreshTokens.userId, req.user.id))

        res.clearCookie('refreshToken')
        res.clearCookie('token')

        res.json('user logged out')
    }catch(err){
        next(err)
    }
}

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try{
        res.json(req.user)
    }catch(err){
        next(err)
    }
}