const jwt = require('jsonwebtoken')
const config = require('config')
const req = require('express/lib/request')

function checkJwtMiddleware(req, res, next) {
  // Get token form header
  const token = req.header('x-auth-token')

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token. Authorization is denied.' })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get('jwtToken'))

    req.user = decoded.user
    next()
  } catch (error) {
    // If not valid for example if 1 was added ot the token
    res.status(401).json({ msg: 'Token is not valid' })
  }
}

module.exports = checkJwtMiddleware
