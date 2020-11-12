const request = require('supertest')
const server = require('./index.js')

describe('index.js module', () => {


  describe('[GET] /', () => {
    it('works', () => {
      return request(server).get('/')
        .expect('Content-Type', /json/)
        .expect('Content-Length', '12')
        .expect({ api: "up" })
    })


  })
})
