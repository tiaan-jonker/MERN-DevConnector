const request = require('supertest')
const server = require('../../../server')

describe('auth test', () => {
  it('Auth tests working', async () => {
    expect(true).toBeTruthy()
  })

  it('Gets the auth endpoint', async () => {
    const res = await server.get('/api/v1/auth')
  })
})
