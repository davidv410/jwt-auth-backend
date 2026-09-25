import 'dotenv/config'
import jwt from 'jsonwebtoken'



export const generateAccessToken = (id: string, name: string, role: string) => {
    return jwt.sign({ id, name, role }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '1h' });
}

export const generateRefreshToken = (id: string, name: string, role: string) => {
    return jwt.sign({ id, name, role }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
}