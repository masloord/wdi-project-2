var express = require('express')
var router = express.Router()
var Gym = require('../models/gym')

router.route('/gym')
.get(function (req, res) {
  Gym.find({}, function (err, allGym) {
    if (err) res.send(err)
    if (!req.user.isUser) {      // if user is not owner cannot view gym page
      res.render('gym', {
        allGym: allGym
      })
    } else {
      res.send('login as Gym Owner')
    }
  })
})
router.route('/gym')
.post(function (req, res, next) {
  var newGym = new Gym(req.body)
  newGym.save(function (err, newGym) {
    if (err) res.send(err)
    res.redirect('/gym')
  })
})

module.exports = router
