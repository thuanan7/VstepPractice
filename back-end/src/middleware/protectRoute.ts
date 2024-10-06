import jwt from "jsonwebtoken";
import {Response, Request, NextFunction} from "express";
import User from "../models/user.model.js";
import {appConfigs} from "../app/configs";
import {extractToken} from "../utils/jwtUtils";

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({message: "Unauthorized - No Token Provided", success: false});
        }

        const decoded = jwt.verify(token, appConfigs.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({message: "Unauthorized - Invalid Token", success: false});
        }

        // @ts-ignore
        const user = await User.findOne({where: {userName: decoded?.userId}})
        if (!user) {
            return res.status(504).json({message: "Unauthorized - Invalid Token", success: false});
        }

        // @ts-ignore
        req.user = user;
        next();
    } catch (error: any) {
        console.log("Error in protectRoute middleware: ", error.message);
        res.status(500).json({error: "Internal server error"});
    }
};

export default protectRoute;
