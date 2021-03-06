const express = require('express')
const router = express.Router()
const auth = require('../../../middleware/auth')
const { check, validationResult } = require('express-validator')
const Profile = require('../../../models/Profile')
const User = require('../../../models/User')

// @BASE ROUTE api/v1/profile
//@req.user.id from generated token

// @route   GET api/v1/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile)
  } catch (error) {
    console.error('Server error in profile: ', error.message)
    res.status(500).send('Server error 500')
  }
})

// @route   POST api/v1/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').notEmpty(),
      check('skills', 'Skills is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() })
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body

    // Build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

    // Build social object
    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      // Find profile
      let profile = await Profile.findOne({ user: req.user.id })

      if (profile) {
        // If found then update
        profile = await Profile.findByIdAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        return res.json(profile)
      }

      // If not found then create profile
      profile = new Profile(profileFields)

      await profile.save()

      res.json(profile)
    } catch (error) {
      console.error('Server error in profile: ', error.message)
      res.status(500).send('Server error 500')
    }
  }
)

// @route   GET api/v1/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async (req, res) => {
  const { user_id } = req.params
  try {
    const profiles = await Profile.find().populate('user', [
      'name',
      'avatar',
      'email',
    ])

    res.json(profiles)
  } catch (error) {
    console.error('Server error in profile: ', error.message)
    res.status(500).send('Server error 500')
  }
})

// @route   GET api/v1/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async (req, res) => {
  const { user_id } = req.params
  try {
    const profile = await Profile.findOne({ user: user_id }).populate('user', [
      'name',
      'avatar',
    ])

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' })
    }

    res.json(profile)
  } catch (error) {
    console.error('Server error in profile: ', error.message)
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server error 500')
  }
})

// @route   DELETE api/v1/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete('/', auth, async (req, res) => {
  const { user_id } = req.params
  try {
    // Remove profile
    await Profile.findOneAndRemove({ user: user_id })

    // Remove user
    await User.findOneAndRemove({ _id: user_id })

    res.json({ msg: 'User deleted' })
  } catch (error) {
    console.error('Server error in profile: ', error.message)
    res.status(500).send('Server error 500')
  }
})

// @route   PUT api/v1/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('from', 'From date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const { id } = req.user

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log({ errors: errors.array() })
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, current, description } =
      req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: id })
      profile.experience.unshift(newExp)
      await profile.save()

      res.json(profile)
    } catch (error) {
      console.error('Server error in profile: ', error.message)
      res.status(500).send('Server error 500')
    }
  }
)

// @route   DELETE api/v1/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  const { id } = req.user
  const { exp_id } = req.params
  try {
    const profile = await Profile.findOne({ user: id })

    // Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(exp_id)

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.json(profile)
  } catch (error) {
    console.error('Server error in profile: ', error.message)
    res.status(500).send('Server error 500')
  }
})


module.exports = router
