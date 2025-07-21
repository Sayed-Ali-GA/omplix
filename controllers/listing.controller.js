const express = require('express')
const router = express.Router()
const Listing = require('../models/listing')



router.get('/new', (req, res) => {
    res.render('listings/new.ejs')
})


router.get('/', async (req, res) => {
     const foundListings = await Listing.find()
       console.log(foundListings)
    res.render('listings/index.ejs', { foundListings: foundListings })
})


router.post('/', async (req, res) => {
        res.redirect('/listings')
    })


module.exports = router 