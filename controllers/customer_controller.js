var express = require('express')
var app = express()
var router = express.Router()
var Gym = require('../models/gym')
var Customer = require('../models/customer')

router.route('/gym/:id/customer/new')
.get(function (req, res) {
  Gym.findById(req.params.id, function (err, foundGym) {
    if (err) res.redirect('/gym/'+foundGym.id)
      // authenticate if is user for gym then can edit

    res.render('customer/new', {gym: foundGym})
  })
})

router.route('/gym/:id/customer/signup')
.post(function (req, res) {
  var newCustomer = new Customer({
    name: req.body.name,
    address: req.body.address,
    rfid: req.body.rfid,
    gym: req.params.id
  })
  newCustomer.save(function (err, newCustomer) {
    if (err) res.redirect('back')
    req.flash('success', 'Added new Customer')
    res.redirect('/gym')
  })
})

router.route('/gym/:id/customer/signin')
.get(function (req, res) {
  Gym.findById(req.params.id, function (err, foundGym) {
    if (err) res.redirect('back')
    res.render('customer/signin', {gym: foundGym})
  })
})
router.route('/gym/:id/customer/signedin')
.post(function (req, res) {
  Customer.findOne({rfid: req.body.rfid}, function (err, customer) {
    if (err) res.redirect('back')
    Gym.findById(req.params.id, function (err, gym) {
      if (err) res.redirect('back')
      gym.customer.push(customer.id)
      gym.save()
      req.flash('success', 'customer signed in')
      res.redirect('/gym/' + gym.id)
    })
  })
})
router.route('/gym/:id/customer/signedout')
.post(function(req,res){
    Customer.findOne({rfid: req.body.rfid}, function (err, foundcustomer) {
          if (err) res.redirect('back')
          Gym.findById(req.params.id, function (err, gym) {
            if (err) res.redirect('back')
            var gymCustomer=gym.customer
            var index=gymCustomer.indexOf(foundcustomer.id)
            gymCustomer.splice(index, 1)
            gym.save()
            req.flash('success', 'customer signed out')
            res.redirect('/gym/' + gym.id)
          })
    })
})


module.exports = router
