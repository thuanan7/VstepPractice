import jwt from "jsonwebtoken";
import {Request, Response} from 'express';
import {appConfigs} from "../app/configs";
export const generateTokenAndSetCookie = (userId:string, res:Response) => {
    const token = jwt.sign({ userId }, appConfigs.JWT_SECRET, {
        expiresIn: "15d",
    });
    return token;
};

export function extractToken (req:Request) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        return `${req.query.token}`;
    }
    return null;
}
