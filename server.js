/*
 * FileName: server.js
 * Project: wd-web-log
 * Author: Gsan
 * File Created: Monday, 1st March 2021 3:54:30 pm
 * Last Modified: Monday, 1st March 2021 3:54:30 pm
 * Modified By: Gsan
 */
const handler = require('serve-handler')
const http = require('http')
const examplesPath = './examples'
const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware Access-Control-Allow-Origin
  // More details here: https://github.com/vercel/serve-handler#options
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')

  return handler(request, response, {
    public: examplesPath,
  })
})

server.listen(5500, () => {
  console.log('Running at http://localhost:5500')
})
