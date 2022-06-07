const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const auth = require('../../../middleware/auth')
const User = require('../../../models/User')

// @route   GET api/v1/auth
// @desc    Test route
// @access  Private
router.get('/', auth, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log({ errors: errors.array() })
    return res.status(400).json({ errors: errors.array() })
  }
  
  try {
    const user = await User.findById(req.user.id).select('password')
    res.json(user)
  } catch (error) {
    console.error('Could not be authorized')
    res.status(500).send('Server error')
  }
})

// @route   POST api/v1/auth
// @desc    Auth user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    // validate entered input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() })
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // check if user exists
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      // match user and password
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] })
      }

      // for jwt.sign
      const payload = {
        user: {
          id: user.id,
        },
      }

      // check https://jwt.io/ for decoded token
      jwt.sign(
        payload,
        config.get('jwtToken'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err
          res.json({ token })
        }
      )
    } catch (error) {
      console.error('Server error: ', error.message)
      res.status(500).send('Server error 500')
    }
  }
)

module.exports = router
