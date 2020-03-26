#!/usr/bin/env node

require('./lib/repository.js')
  .then(data => {
    process.stdout.write(JSON.stringify(data))
  })
  .catch(err => {
    console.error(err)
  })
