var express = require('express')
var router = express.Router()
var Gym = require('../models/gym')
var Review = require('../models/review')

// ======
// show allGym
// =======
router.route('/gym')
.get(function (req, res) {
  Gym.find({}, function (err, allGym) {
    if (err) res.send(err)
        // if user is not owner cannot view gym page
    res.render('gymtab/gym', {
      allGym: allGym
    })
  })
})
// ======
// create
// ======
router.route('/gym/new')
.get(function (req, res) {
  if (!req.user.isUser) {
    res.render('gymtab/new')
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
// show gym owned my owner
// =====================
router.route('/gym/user')
.get(function (req, res) {
  Gym.find({user: req.user.id}, function (err, Gym) {
    if (err) res.send(err)
    res.render('gymtab/gymlist', {
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
    if (req.user.id == foundGym.user) {
      console.log(req.body)
      res.render('gymtab/edit', {gym: foundGym})
    } else {
      res.send('wrong user')
    }
  })
})
router.route('/gym/:id') // show one
.get(function (req, res) {
  Gym.findById(req.params.id).populate('review').exec(function (err, foundGym) {
    if (err) throw err
    // console.log(foundGym)
    res.render('gymtab/showone', {Gym: foundGym})
  })
})

.put(function (req, res) {
  console.log('update')
  Gym.findOneAndUpdate(req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      capcity: req.body.capcity
    }, function (err, updatedGym) {
      if (err) res.redirect('/')
      res.redirect('/gym/' + req.params.id)
    })
})
// ===============
// delete
// ===============

.delete(function (req, res) {
  Gym.findByIdAndRemove(req.params.id,
   function (err, Gym) {
     if (err) res.redirect('/')
     res.redirect('/gym/user')
   })
})

module.exports = router
