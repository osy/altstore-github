var config = require('./config.js')
const express = require('express')

const app = express()
const host = config.get('ip')
const port = config.get('port')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  const repo = require('./lib/repository.js')
  repo
    .then(data => {
      res.status(200).send(data)
    })
    .catch(err => {
      res.status(500).send(err)
    })
})

app.listen(port, host, () => {
  console.log(`🌏 Server is running at http://${host}:${port}`)
})
