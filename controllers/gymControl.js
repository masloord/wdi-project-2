var express = require('express')
var router = express.Router()
var Gym = require('../models/gym')

// ======
// show
// =======
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

router.route('/gym/new')
.get(function (req, res) {
  res.render('new')
})
.post(function (req, res, next) {
  console.log('create')
  var newGym = new Gym(req.body)
  newGym.save(function (err, newGym) {
    if (err) res.send(err)
    res.redirect('/gym')
  })
})

// ======
// update
// =======

router.route('/gym/:id/edit')
.get(function (req, res) {
  console.log('find gym and update')
  Gym.findById(req.params.id, function (err, foundGym) {
    if (err) res.send(err)
    console.log(req.body)
    res.render('show', {gym: foundGym})
  })
})
router.route('/gym/:id')
.put(function (req, res) {
  console.log('update')
  Gym.findOneAndUpdate(req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      capcity: req.body.capcity
    }, function (err, updatedGym) {
      if (err) res.redirect('/')
      res.redirect('/gym')
    })
})

// =====
// delete
// =======
router.route('/gym/:id')
.delete(function (req, res) {
  Gym.findByIdAndRemove(req.params.id,
   function (err, Gym) {
     if (err) res.redirect('/')
     res.redirect('/gym')
   })
})
module.exports = router
