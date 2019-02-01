'use strict'

class User {
  me ({ context: { user }}) {
    return user
  }
}

module.exports = User
