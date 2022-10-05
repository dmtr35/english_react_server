import 'dotenv/config'
import mongoose from 'mongoose'
import Collections from '../models/Collections.js'
import Words from '../models/Words.js'

import path from 'path'
import fs from 'fs'
import util from 'util'
const __dirname = path.resolve()




class CollectionsController {
    async createCollections(req, res) {
        try {
            const { userId } = req.params
            const { name, filterArrWord } = req.body

            const words = JSON.parse(filterArrWord)
            const session = await mongoose.startSession()
            await session.withTransaction(async () => {
                const collections = await Collections.create([{ userId, name }], { session })
                await Words.create([{ collId: `${collections[0]._id}`, words }], { session })
                return await res.json(collections[0])
            })

            // session.commitTransaction()
            session.endSession()
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Create(without file) error' + e })
        }
    }

    async createFromFile(req, res) {
        try {
            const { userId } = req.params
            const { name, filterArrWord } = req.body
            const words = JSON.parse(filterArrWord)
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
                    words.push(objWord)
                }
            })
            const session = await mongoose.startSession()
            await session.withTransaction(async () => {
                const collections = await Collections.create([{ userId, name }], { session })
                await Words.create([{ collId: `${collections[0]._id}`, words }], { session })
                return await res.json(collections[0])
            })
            // session.commitTransaction()
            session.endSession()
        }
        catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Create error2' })
        }
    }

    async addWorlds(req, res) {
        try {
            const collectionId = req.params.id
            const { filterArrWord } = req.body
            const arrWord = JSON.parse(filterArrWord)

            await Collections.updateOne({ "_id": collectionId }, { "$push": { "words": { "$each": arrWord } } })
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
            const session = await mongoose.startSession()
            await session.withTransaction(async () => {
                const collections = await Collections.create([{ userId, name }], { session })
                await Words.create([{ collId: `${collections[0]._id}`, words }], { session })
                return await res.json(collections[0])
            })
            // session.commitTransaction()
            session.endSession()
            fs.rm(path.resolve(__dirname, './static/dictionary.txt'), (err) => {
                if (err) {
                    throw err
                }
            })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Create(with file) error' + e })
        }
    }

    async getCollections(req, res) {
        try {
            const { userId } = req.params
            const collections = await Collections.find({ userId })
            return res.json(collections)
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'get collections error' + e })
        }
    }

    async updateCollection(req, res) {
        try {
            const collectionId = req.params.id
            const name = req.body
            await Collections.findByIdAndUpdate(collectionId, name, { new: true })
            return res.json("update")
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Collection not rename,  error' + e })
        }
    }

    async deleteOneCollection(req, res) {
        try {
            const collectionId = req.params.id
            const session = await mongoose.startSession()
            await session.withTransaction(async () => {
                await Collections.findByIdAndDelete(collectionId, { session })
                await Words.deleteOne({ "collId": collectionId }, { session })
                return await res.json("collection delete")
            })
            // session.commitTransaction()
            session.endSession()
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'selected collection not delete, error' + e })
        }
    }

    async deleteManyCollection(req, res) {
        try {
            const { arrCollId } = req.body
            const session = await mongoose.startSession()
            await session.withTransaction(async () => {
                await Collections.deleteMany({ _id: { $in: arrCollId } }, { session })
                await Words.deleteMany({ collId: { $in: arrCollId } }, { session })
                return await res.json("selected collections delete")
            })
            // session.commitTransaction()
            session.endSession()
            return await res.json("collection delete")
        } catch (e) {
            console.log(e)
            await session.abortTransaction()
            res.status(500).json({ message: 'The transaction was aborted' + e })
        }
    }

}




export default new CollectionsController()
