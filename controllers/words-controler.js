import 'dotenv/config'
import mongoose from 'mongoose'
import Words from '../models/Words.js'
import path from 'path'
import fs from 'fs'
import util from 'util'
const __dirname = path.resolve()




class WordsController {

    async addWorlds(req, res) {
        try {
            const collectionId = req.params.id
            const { filterArrWord } = req.body
            const arrWord = JSON.parse(filterArrWord)
            await Words.updateOne({ "collId": collectionId }, { "$push": { "words": { "$each": arrWord } } })
            return res.json("excellent")
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Create error2' })
        }
    }
    async addWordsFromFile(req, res) {
        try {
            const collectionId = req.params.id
            const { filterArrWord } = req.body
            const arrWord = JSON.parse(filterArrWord)
            const file = req.files.file
            await file.mv(path.resolve(__dirname, 'static', 'dictionary.txt'))
            const readFile = util.promisify(fs.readFile)
            const result = await readFile(path.resolve(__dirname, './static/dictionary.txt'), 'utf-8')
            result.split(/\r?\n/).forEach(line => {
                if (line.length === 0) {
                    return
                } else {
                    const word = `${line}`.split(';')
                    const objWord = Object.assign({ eng: word[0], rus: word[1] })
                    arrWord.push(objWord)
                }
            })
            await Words.updateOne({ "collId": collectionId }, { "$push": { "words": { "$each": arrWord } } })
            fs.rm(path.resolve(__dirname, './static/dictionary.txt'), (err) => {
                if (err) {
                    throw err
                }
            })
            return res.json("excellent")
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Create error2' })
        }
    }


    async getWords(req, res) {
        try {
            const { collId } = req.body
            const words = await Words.find({ collId: { $in: collId } })
            return res.json(words)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Get words error' + e })
        }
    }


    async updateWords(req, res) {
        try {
            const { wordId } = req.params
            const arrWord = req.body
            await Words.findOneAndUpdate({ "words._id": wordId }, { "$set": { "words.$": arrWord } }, { new: true })
            return res.json("Word renamed")
        } catch (e) {
            res.status(500).json({ message: 'Word renamed, error:' + e })
        }
    }


    async deleteOneWord(req, res) {
        try {
            const collectionId = req.params.id
            const { wordId } = req.body
            await Words.updateOne({ "collId": collectionId }, { "$pull": { "words": { "_id": wordId } } })
            return res.status(200).json({ wordId })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Word not delete, error:' + e })
        }
    }


    async deleteAndMove(req, res) {
        try {
            const transferWord = req.params.id
            const { currentCollId, arrWord, wordId } = req.body
            const session = await mongoose.startSession()
            await session.withTransaction(async () => {
                await Words.updateOne({ "collId": currentCollId }, { "$pull": { "words": { "_id": wordId } } }, { session })
                await Words.updateOne({ "collId": transferWord }, { "$push": { "words": { "$each": arrWord } } }, { session })
                return await res.json("word moved")
            })
            // session.commitTransaction()
            session.endSession()
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'happened somewhere error:' + e })
        }
    }
}




export default new WordsController()
