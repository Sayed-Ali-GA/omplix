const express = require('express')
const router = express.Router()
const Listing = require('../models/listing')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../config/multer')


router.get('/new', isSignedIn, (req, res) => {
    res.render('listings/new.ejs')
})


router.get('/',  async (req, res) => {
     const foundListings = await Listing.find()
       console.log(foundListings)
    res.render('listings/index.ejs', { foundListings: foundListings })
})


// router.post('/', isSignedIn, upload.single('image'), async (req, res) => {
//     try {
//         req.body.image = {
//             req.body.seller = req.session.user._id
//             url: req.file.path,
//             cloudinary_id: req.file.fieldname
//         }
//         await Listing.create(req.body)
//         res.redirect('/listings')
//     } catch (error) {
//         console.log(error)
//         res.send('Something went wrong')
//     }
// })


//try--------------------------------------------------------
router.post('/', isSignedIn, upload.single('image'), async (req, res) => {
    try {
        req.body.seller = req.session.user._id
        req.body.image = {
            url: req.file.path,
            cloudinary_id: req.file.fieldname
        }
        await Listing.create(req.body)
        res.redirect('/listings')
    } catch (error) {
        console.log(error)
        res.send('Something went wrong')
    }
})
router.get('/:listingId', async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('seller').populate('comments.author')
    console.log(foundListing)
    console.log(req.session.user)
    console.log(foundListing.seller._id.equals(req.session.user._id))
    res.render('listings/show.ejs', { foundListing: foundListing })
})
//try--------------------------------------------------------






router.get('/', async (req, res) => {
    const foundListings = await Listing.find()
    console.log(foundListings)
    res.render('listings/index.ejs', { foundListings: foundListings })
})

router.get('/:listingId', async (req, res) => {
        const foundListing = await Listing.findById(req.params.listingId).populate('seller').populate('comments.author')
  try { 
    console.log(foundListing)
    console.log(req.session.user)
    console.log(foundListing.seller._id.equals(req.session.user._id))
    res.render('listings/show.ejs', { foundListing: foundListing })


    } catch (error){
        console.log(error)
 }  
})

router.get('/:listingId', async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('seller').populate('comments.author')
  try { 
    console.log(foundListing)
    console.log(req.session.user)
    console.log(foundListing.seller._id.equals(req.session.user._id))
    res.render('listings/show.ejs', { foundListing: foundListing })


    } catch (error){
        console.log(error)
 }  
})



module.exports = router 