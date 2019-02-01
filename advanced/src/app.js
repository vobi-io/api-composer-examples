const express = require('express')
const bodyParser = require('body-parser')
const graphqlHTTP = require('express-graphql')
const { mergeApis } = require('@giiorg/vobi-api-composer-experimental')
const { authMiddleware } = require('app/policies/auth-middleware')
const userApi = require('./modules/user/api')

const app = express()
app.use(bodyParser.json())

const api = mergeApis([userApi])

// console.log(api.getExpressRoutes())

app.use(authMiddleware)

api.onError(function (err, res) {
  res.status(err.statusCode)
  res.send(err.payload)
  return
})
app.use(api.getExpressRoutes())

app.use(
  '/graphql',
  graphqlHTTP({
    schema: api.getGraphqlSchema(),
    graphiql: true
  })
)

app.listen(8000, function () {
  console.log('app running on 8000')
  console.log('Go to http://localhost:8000 for express routes')
  console.log('Go to http://localhost:8000/graphql for graphql')
})

