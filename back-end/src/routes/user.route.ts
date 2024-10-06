import { Router } from 'express'
import {login} from "../controllers/user.controller";
const userRoute = Router()
userRoute.post('/login',  login)
export default userRoute
