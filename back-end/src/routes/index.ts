import { Router } from 'express'
import userRoute from './user.route';
import websiteRoute from './website.route';
import crawlRoute from './crawl.route';
import conferenceRoute from './conference.route';
const router = Router()
router.use('/user', userRoute)
router.use('/website', websiteRoute)
router.use('/crawl', crawlRoute)
router.use('/conference', conferenceRoute)
export default router
