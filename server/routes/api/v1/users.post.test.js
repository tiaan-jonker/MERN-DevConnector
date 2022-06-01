const request = require('supertest')
const server = require('../../../server')
const User = require('../../../models/User')

jest.mock('../../../models/User')

const mockUser = {
  name: 'Tiaan',
  email: 'tiaan@gmail.com',
  password: 'meaningoflife42',
}

// describe('POST /api/v1/users', () => {
//   it('responds with status 401 when no token is passed', () => {
//     request(server)
//       .post('/api/v1/users')
//       .then((res) => {
//         expect(res.status.toBe(401))
//         return null
//       })
//   })
// })
