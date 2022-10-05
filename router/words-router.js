import Router from "express"
import wordsController from "../controllers/words-controler.js"
import authMiddleware from '../middlewares/auth-middleware.js'
const wordsRouter = new Router()



wordsRouter.post('/addWorlds/:id', wordsController.addWorlds)
wordsRouter.post('/addWordsFromFile/:id', wordsController.addWordsFromFile)



wordsRouter.post('/getWords/', authMiddleware, wordsController.getWords)
// wordsRouter.post('/getWords/', wordsController.getWords)



wordsRouter.post('/updateWords/:wordId', wordsController.updateWords)



wordsRouter.post('/deleteOneWord/:id', wordsController.deleteOneWord)




wordsRouter.post('/deleteAndMove/:id', wordsController.deleteAndMove)



export default wordsRouter