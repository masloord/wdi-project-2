var express = require('express')
var router = express.Router()
var Gym = require('../models/gym')

// ======
// show allGym
// =======
router.route('/gym')
.get(function (req, res) {
  Gym.find({}, function (err, allGym) {
    if (err) res.send(err)
        // if user is not owner cannot view gym page
    res.render('gym', {
      allGym: allGym
    })
  })
})
// ======     //1)find req param id
// create     //2)
// ======
router.route('/gym/new')
.get(function (req, res) {
  if (!req.user.isUser) {
    res.render('new')
  } else {
    res.send('sign in as Owner')
  }
})
.post(function (req, res, next) {
  console.log('create')
  console.log(req.user.id)
  var newGym = new Gym({
    name: req.body.name,
    description: req.body.description,
    capcity: req.body.capcity,
    user: req.user.id
  })
  newGym.save(function (err, newGym) {
    if (err) res.send(err)
    res.redirect('/gym/user')
  })
})

// ======================
// show gym own my owner
// =====================
router.route('/gym/user')
.get(function (req, res) {
  Gym.find({user: req.user.id}, function (err, Gym) {
    if (err) res.send(err)
    res.render('gymlist', {
      Gym: Gym
    })
  })
})
// ======
// update
// =======

router.route('/gym/:id/edit')
.get(function (req, res) {
  console.log('find gym and update')
  console.log('user', req.user.id)
  Gym.findById(req.params.id, function (err, foundGym) {
    if (err) res.send(err)
    if (req.user.id === foundGym.id) {
      // authenticate if is user for gym then can edit
      console.log(req.body)
      res.render('show', {gym: foundGym})
    }
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
.delete(function (req, res) {
  Gym.findByIdAndRemove(req.params.id,
   function (err, Gym) {
     if (err) res.redirect('/')
     res.redirect('/gym/user')
   })
})
module.exports = router

// =====
// delete
// =======
// router.route('/gym/:id')
