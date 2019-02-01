'use strict'

const UserModel = require('app/modules/user/user')
const JwtService = require('app/services/jwt-service')
const config = require('app/config')
const { generateHash, error } = require('app/utils')

const jwt = new JwtService(config.jwt)

class Auth {
  async isAuthorized ({ context }) {
    if (!context.user) {
      return error({
        payload: {
          message: 'User not authorized',
          code: 'user-not-found',
        },
        statusCode: 401
      })
    }
  }

  async signUp ({ args: { record: { firstName, lastName, email, password } } }) {
    const emailExists = await UserModel.checkIfEmailExist(email)
    if (emailExists) {
      // throw or return error
      console.log('Email already exists')
      throw new Error('Email already exists')
    }

    const user = new UserModel({
      email,
      password: generateHash(password),
      firstName,
      lastName,
    })

    await user.save()

    const accessToken = jwt.sign({ id: user.id })

    return {
      accessToken: accessToken,
    }
  }

  async signIn ({ args: { record: { email, password } } }) {
    const user = await UserModel.findOneByEmail(email)

    if (!user) {
      console.log('The email doesn’t match any account or not active')
      return new Promise.reject(
        MyError.notFound(`The email doesn’t match any account or not active.`)
      )
    }

    if (!user.validatePassword(password)) {
      return Promise.reject(
        MyError.notFound('The password you’ve entered is incorrect.')
      )
    }

    const accessToken = jwt.sign({ id: user.id })

    return {
      accessToken: accessToken
    }
  }
}

module.exports = Auth
