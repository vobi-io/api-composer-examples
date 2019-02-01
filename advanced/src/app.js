const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { mergeApis } = require('@vobi/api-composer')
const { authMiddleware } = require('app/policies/auth-middleware')
const userApi = require('./modules/user/api')

const app = express()
app.use(bodyParser.json())

const api = mergeApis([userApi])

// console.log(api.getExpressRoutes())

app.use(authMiddleware)

api.onError(function (err, res) {
  // TODO: make this dynamic, e. g. with some errors' enum
  if (err === 'user-not-authorized') {
    res.status(401)
    res.json({
      message: 'User not authorized',
      code: 'user-not-authorized'
    })
  }
  res.json(err)
  return
})
app.use(api.getExpressRoutes())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: api.getGraphqlSchema(),
    graphiql: true,
  })
)

app.listen(8000, function () {
  console.log('app running on 8000')
  console.log('Go to http://localhost:8000 for express routes')
  console.log('Go to http://localhost:8000/graphql for graphql')
})

