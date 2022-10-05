import Router from "express"
import collectionsController from "../controllers/collections-controler.js"
import authMiddleware from '../middlewares/auth-middleware.js'
const collectionsRouter = new Router()



collectionsRouter.post('/createCollections/:userId', collectionsController.createCollections)



collectionsRouter.get('/getCollections/:userId', authMiddleware, collectionsController.getCollections)
// collectionsRouter.get('/getCollections/:userId', collectionsController.getCollections)



collectionsRouter.post('/updateCollection/:id', collectionsController.updateCollection)



collectionsRouter.delete('/deleteOneCollection/:id', collectionsController.deleteOneCollection)



collectionsRouter.post('/deleteManyCollection/', collectionsController.deleteManyCollection)



collectionsRouter.post('/createFromFile/:userId', collectionsController.createFromFile)


export default collectionsRouter