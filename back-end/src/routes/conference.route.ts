import { Router } from "express";
import { getAll, deleteById } from "../controllers/conference.controller";

const conferenceRouter = Router();

conferenceRouter.get("/", getAll);
conferenceRouter.delete("/:id", deleteById);
export default conferenceRouter;
