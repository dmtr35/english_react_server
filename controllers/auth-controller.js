import 'dotenv/config'
import User from '../models/User.js'
import tokenService from '../service/token-service.js'
import bcrypt from 'bcrypt'
import { validationResult } from 'express-validator'



class AuthController {
    async registration(req, res) {

        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка при регистрации', errors })
            }
            const { email, password } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: `Пользователь с email: ${email} уже существует` })
            }
            const hashPassword = bcrypt.hashSync(password, 7)
            const user = new User({ email, password: hashPassword })
            await user.save()
            return res.json({ message: 'Пользователь был успешно зарегистрирован' })
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: `Пользоватеть с email ${email} не найден` })
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({ message: 'Введен не верный пароль' })
            }
            const token = tokenService.generateAccessToken(user._id, user.email)
            return res.json(token)
        } catch (e) {
            console.log(e)
            res.status(400).json({ message: 'Registration error' })
        }
    }

    async check(req, res) {
        const token = tokenService.generateAccessToken(req.user.id, req.user.email)
        return res.json(token)
    }
}


export default new AuthController()

