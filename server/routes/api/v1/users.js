const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../../../models/User')

// @route   POST api/v1/users
// @desc    Register route
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with six or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    // validate entered input
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() })
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // check if user exists
      let user = await User.findOne({ email })
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] })
      }

      // if not then create new instance
      const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' })
      user = new User({
        name,
        email,
        avatar,
        password,
      })

      const saltRounds = 10

      // encrypt user password
      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(password, salt)

      // save user to database
      await user.save()

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
