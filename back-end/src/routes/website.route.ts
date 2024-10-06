import {Router} from 'express'
import {
    createWebsite,
    updateWebsite,
    deleteWebsite,
    getAllWebsites,
    editWebsite
} from "../controllers/website.controller";
import protectRoute from "../middleware/protectRoute";
const websiteRouter = Router()
websiteRouter.get('/', protectRoute, getAllWebsites)
websiteRouter.get('/:id', protectRoute, editWebsite)
websiteRouter.post('/', protectRoute, createWebsite)
websiteRouter.put('/:id', protectRoute, updateWebsite)
websiteRouter.delete('/:id', protectRoute, deleteWebsite)
export default websiteRouter
