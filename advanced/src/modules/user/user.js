const { mongoose } = require('app/db-conn')

const schema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
    required: true,
    match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, 'Please fill a valid email address'],
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
})

schema.methods.validatePassword = function (password) {
  const bcrypt = require('bcrypt-nodejs')

  return bcrypt.compareSync(password, this.password)
}

schema.statics.findOneByEmail = function (email) {
  return this.findOne({
    email: { $regex: `^${email}$`, $options: 'i' }
  })
}

schema.statics.checkIfEmailExist = function (email) {
  return this.findOne({
    email: { $regex: `^${email}$`, $options: 'i' },
  })
}

schema.statics.findById = function (id) {
  return this.findOne({
    _id: id,
  })
}

const UserModel = mongoose.model('User', schema) 

module.exports = UserModel
