import {Router} from 'express'
import {
    crawManual,
    runJob
} from "../controllers/crawl.controller";
import protectRoute from "../middleware/protectRoute";

const crawlRouter = Router()

crawlRouter.post('/:id', protectRoute, crawManual)
crawlRouter.post('/job/run', protectRoute, runJob)
export default crawlRouter
