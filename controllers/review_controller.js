var express = require('express')
var router = express.Router()
var Review = require('../models/review')
var Gym = require('../models/gym')

router.route('/gym/:id/review')
.post(function (req, res) {
  Gym.findById(req.params.id, function (err, gym) {
    if (err) res.send(err)
    var newReview = new Review({
      title: req.body.title,
      description: req.body.description,
      rating: req.body.rating
    })
    newReview.save(function (err, newReview) {
      if (err) res.send(err)
      console.log('abt to save review inside gym')
      gym.review.push(newReview)
      gym.save()
      res.redirect('/gym/' + gym.id)
    })
  })
})

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

router.route('/gym/:id/review/:review_id/edit')
.get(function (req, res) {
  Review.findById(req.params.review_id, function (err, foundReview) {
    if (err) res.redirect('back')
    res.render('reviewtab/edit', {
      gym_id: req.params.id,
      review: foundReview
    })
  })
})
router.route('/gym/:id/review/:review_id/')
.put(function (req, res) {
  Review.findByIdAndUpdate(req.params.review_id, req.body, function (err, updatedReview) {
    if (err)res.redirect('back')
    res.redirect('/gym/' + req.params.id)
  })
})
.delete(function (req, res) {
  Review.findByIdAndRemove(req.params.review_id,
   function (err, Gym) {
     if (err) res.redirect('back')
     res.redirect('/gym/' + req.params.id)
   })
})

module.exports = router
