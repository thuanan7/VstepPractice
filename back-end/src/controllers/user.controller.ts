import {Request, Response} from 'express'
import * as service from '../services/user.service'

export const login = async (req: Request, res: Response) => {
    try {
        const {username, password} = req.body;
        if (!username || !password) {
            res.status(400).json({message: "Please send full username and password", success: false});
        }
        const {
            success, user, token
        } = await service.loginService(username, password, res);
        if (!success || !token) {
            res.status(400).json({message: "Invalid username or password", success: false});
        } else {
            res.status(200).json({
                data: {
                    fullName: `${user?.firstName}_${user?.lastName}`,
                    username: user?.userName,
                    token: token
                },
                message: "Login successfully",
                success: true
            });
        }
    } catch (error: any) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: "Internal Server Error"});
    }
};
