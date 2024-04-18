
const userDB = require('../db/user');
const signUpReqDB = require('../db/signUpReq');
const { UserSchema } = require('../util/schema/userSchema');
const util = require('../util/util');
class userService {
    constructor() {
        this.userDB = new userDB()
        this.signUpReqDb = new signUpReqDB()
    }

    async getUser({ id }) {
        try {
            const user = await this.userDB.get(id);
            if (!user) throw { httpCode: 404, code: 'user-not-found', message: `Invalid User Id` }
            return user;
        } catch (error) {
            throw error
        }
    }

    async createUser(userData) {
        try {
            // TODO: convert email to lower case before db call 
            if (userData.email && (await this.userDB.getByquery({ email: userData.email }))?.length) {
                throw { code: 'duplicate-email', message: `This email is already exist ${userData.email}` }
            }
            if (userData.phoneNumber && (await this.userDB.getByquery({ phoneNumber: userData.phoneNumber }))?.length) {
                throw { code: 'duplicate-phones-number', message: `This phoneNumber is already exist ${userData.phoneNumber}` }
            }
            const user = await this.userDB.create(new UserSchema(userData));
            return util.responseFormate(user);
        } catch (error) {
            throw error
        }
    }

    async userLogin(loginData) {
        try {
            let userData
            // TODO: convert email to lower case before db call 
            console.log(":::::::loginData", loginData)
            if (loginData.email) {
                userData = (await this.userDB.getByquery({ email: loginData.email }))?.[0]
            } else if (loginData.phoneNumber) {
                userData = (await this.userDB.getByquery({ phoneNumber: loginData.phoneNumber }))?.[0];
            }
            if (!userData) throw { httpCode: 404, code: 'user-not-found', message: loginData.email ? `This email ${loginData.email}  does not exist` : `This phoneNumber ${loginData.phoneNumber} does not exist` }
            if (!(util.verifyPassword({ ...userData.password, password: loginData.password }))) {
                throw { httpCode: 400, code: 'invalide-password', message: `Invalid password` }
            }
            return util.responseFormate(userData);
        } catch (error) {
            throw error
        }
    }

    async signUp(signUpData) {
        try {
            let querData = {}
            if (signUpData.email) {
                querData = { email: signUpData.email }
            } else if (signUpData.phoneNumber) {
                querData = { phoneNumber: signUpData.phoneNumber }
            }
            const userData = (await this.userDB.getByquery(querData))?.[0]
            if (userData) throw { httpCode: 404, code: 'user-exist', message: `This ${signUpData.phoneNumber ? 'phoneNumber' : 'email'} ${signUpData.phoneNumber || signUpData.phoneNumber}already exist` }
            const dbSignUpData = (await this.signUpReqDb.getByquery(querData))?.[0];
            const otpData = util.generateOTP(signUpData)
            if (dbSignUpData) {
                await this.signUpReqDb.update(dbSignUpData._id, { ...otpData })
            } else {
                await this.signUpReqDb.create({ ...signUpData, ...otpData })
            }
            return { message: 'Do Register with your otp' };
        } catch (error) {
            throw error
        }
    }
    async updateUser(uid, userData) {
        try {
            // TODO: convert email to lower case before db call 
            if (userData.email && (await this.userDB.getByquery({ email: userData.email }))?.length) {
                throw { code: 'duplicate-email', message: `This email is already exist ${userData.email}` }
            }
            if (userData.phoneNumber && (await this.userDB.getByquery({ phoneNumber: userData.phoneNumber }))?.length) {
                throw { code: 'duplicate-phones-number', message: `This phoneNumber is already exist ${userData.phoneNumber}` }
            }
            const updateData = {
                countryCode: userData.countryCode,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
                name: userData.name
            }
            await this.userDB.update(uid, JSON.parse(JSON.stringify(updateData)));
            const user = (await this.userDB.getByquery({ _id: uid }))[0]
            return util.responseFormate(user);
        } catch (error) {
            throw error
        }
    }
}



module.exports = userService;