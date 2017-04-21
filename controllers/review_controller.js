var express = require('express')
var router = express.Router()
var Review = require('../models/review')
var Gym = require('../models/gym')

// =======
// create
// =======
router.route('/gym/:id/review/new')
.get(function (req, res) {
  console.log('new review')
  Gym.findById(req.params.id, function (err, foundGym) {
    if (err) res.send(err)
      // authenticate if is user for gym then can edit
    console.log(req.body)
    res.render('reviewtab/new', {gym: foundGym})
  })
})

router.route('/gym/:id/review')
.post(function (req, res) {
  Gym.findById(req.params.id, function (err, gym) {
    if (err) res.send(err)
    var newReview = new Review({
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating,
      author: req.user.id,
      chiobuIndex: req.body.chiobuIndex,
      hunkIndex: req.body.hunkIndex
    })
    newReview.save(function (err, newReview) {
      if (err) res.send(err)
      console.log('abt to save review inside gym')
      gym.review.push(newReview)
      gym.save()
      req.flash('success', 'added new review')
      res.redirect('/gym/' + gym.id)
    })
  })
})

// =======
// edit
// =======

router.route('/gym/:id/review/:review_id/edit')
.get(checkReviewOwnership, function (req, res) {
  Review.findById(req.params.review_id, function (err, foundReview) {
    if (err) {
      req.flash('error', 'error has occured')
      res.redirect('back')
    }
    res.render('reviewtab/edit', {
      gym_id: req.params.id,
      review: foundReview
    })
  })
})
// =======
// update
// =======
router.route('/gym/:id/review/:review_id/')
.put(function (req, res) {
  Review.findByIdAndUpdate(req.params.review_id, req.body, function (err, updatedReview) {
    if (err)res.redirect('back')
    req.flash('success', 'Update Sucessful')
    res.redirect('/gym/' + req.params.id)
  })
})
// =======
// delete
// =======
.delete(checkReviewOwnership, function (req, res) {
  Review.findByIdAndRemove(req.params.review_id,
   function (err, Gym) {
     if (err) res.redirect('back')
     req.flash('success', 'Delete Sucessful')
     res.redirect('/gym/' + req.params.id)
   })
})
// ===============================
// middleware to authenticate user
// =================================
function checkReviewOwnership (req, res, next) {
  if (req.isAuthenticated()) {
    console.log('user logged in')
    Review.findById(req.params.review_id, function (err, review) {
      if (err) res.redirect('back')
      if (review.author == req.user.id) {
        next()
      } else {
        res.redirect('back')
      }
    })
  } else {
    res.redirect('back')
  }
}

module.exports = router
