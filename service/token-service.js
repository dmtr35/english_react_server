import jwt from 'jsonwebtoken'

class TokenServise {
    generateAccessToken(id, email) {
        const payload = {
            id,
            email
        }
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' })
        return {
            accessToken,
            id,
            expiresIn: Date.now() + 86400000
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (e) {
            return null
        }
    }
}

export default new TokenServise