const express = require('express')
const router = express.Router()
const Listing = require('../models/listing')
const isSignedIn = require('../middleware/is-signed-in')
const upload = require('../config/multer')
const User = require('../models/user')
//-------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/new', isSignedIn, (req, res) => {
    res.render('listings/new.ejs')
})
//------------------------------------------------------------------------
router.get('/',isSignedIn, async  (req, res) => {
     const foundListings = await Listing.find()
    res.render('listings/index.ejs', { foundListings: foundListings })
})
//--------------------------------------------------------
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
        res.send(`Something went wrong. Please try again later.${user._id}`)
    }
})

// new for wishlist--------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/wishlist', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id).populate('wishlist')
    res.render('listings/wishlist.ejs', { wishlist: user.wishlist, user: user })
  } catch (err) {
    res.send(`Error loading wishlist, Please try again later:${user._id}`)
  }
}) 
//---------------------------------------------------------------------------------
router.post('/:listingId/wishlist', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    const listingId = req.params.listingId

    if (!user.wishlist.includes(listingId)) {
      user.wishlist.push(listingId)
      await user.save()
    }

    res.redirect('/listings/' + listingId)
  } catch (err) {
    res.send(`Error adding to wishlist, Please try again later.${user._id}`)
  }
})
// finsh of wishlist-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
router.get('/:listingId', async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('seller').populate('comments.author')
    res.render('listings/show.ejs', { foundListing: foundListing })
})
//try--------------------------------------------------------
router.get('/:listingId/edit', async (req, res) => {
      const foundListing = await Listing.findById(req.params.listingId).populate('seller')
    
     if(foundListing.seller._id.equals(req.session.user._id)){
       return res.render('listings/edit.ejs', { foundListing: foundListing})
     }
     return res.send('Not authorized')   
})
//------------------------------------------------------------------------
router.put('/:listingId', async (req, res) => {
     const foundListing = await Listing.findById(req.params.listingId).populate('seller')

    if(foundListing.seller._id.equals(req.session.user._id)){
        await Listing.findByIdAndUpdate(req.params.listingId, req.body, {new: true})
        return res.redirect(`/listings/${req.params.listingId}`)
     }
     return res.send('Not authorized') 
})
//--------------------------------- Delete from mongoose ---------------------------------------
router.delete('/:listingId', async (req, res) => {
 const foundListing = await Listing.findById(req.params.listingId).populate('seller')
if(foundListing.seller._id.equals(req.session.user._id)){
await foundListing.deleteOne()
return res.redirect('/listings')
}
 return res.send('Not authorized')
})
// ------------------------ remove from wishlist -----------------------------//
router.delete('/:listingId/wishlist', isSignedIn, async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id)
    const listingId = req.params.listingId
    user.wishlist = user.wishlist.filter(id => id.toString() !== listingId)
    await user.save()
    res.redirect('/listings/wishlist')
  } catch (error) {
    res.send(`Error removing from wishlist, Please try again later:${user._id}`)
  }
})
//------------------------------------------------------------------------
router.post('/:listingId/comments', isSignedIn, async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId)
    req.body.author = req.session.user._id
    foundListing.comments.push(req.body)
    await foundListing.save()
    res.redirect(`/listings/${req.params.listingId}`)
})
//------------------------------------------------------------------------
router.get('/', async (req, res) => {
    const foundListings = await Listing.find()
    res.render('listings/index.ejs', { foundListings: foundListings })
})
//------------------------------------------------------------------------
module.exports = router 