const userService = require('../service/userService')

module.exports = async (req, res, next) => {
    try {
        const UserService = new userService();
        const { value } = req.locals
        const result = await UserService.signUp(value)
        return res.status(200).send(result)
    } catch (error) {
        console.log(":::::::", error)
        console.error('error', error.stack)
        if (error.code && error.message) {
            return res.status(5000).send({ code: error.code, message: error.message })
        }
        res.status(500).send({ message: 'Internan Server error' })
    }
}