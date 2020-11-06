// require express
const express = require('express')

// require passport
const passport = require('passport')

// pull in the mongoose model for Post
const Post = require('../models/post')

// require the custom error method
const customErrors = require('../../lib/custom_errors')

// require 404 error method
const handle404 = customErrors.handle404

// require the requireOwnership method
const requireOwnership = customErrors.requireOwnership

// require the remove blank fields method
const removeBlanks = require('../../lib/remove_blank_fields')

// This will make it so that the rout this is called on will be an authenticated route
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()
// ===================
// Below are all the custom routes for a Users Post

// INDEX
// GET /posts
router.get('/posts', requireToken, (req, res, next) => {
	//find all posts
	Post.find()
		.then(posts => {
			//posts will be an array of mongoose docs
			// we will use `.map` to convert to POJO
			// using `.toObject`
			return posts.map(post => post.toObject())
		})
		// respond with status 200 and JSON of the posts
		.then(posts => res.status(200).json({ posts }))
		//if an error occures pass to handler
		.catch(next)
})

// show
// GET /posts/:id
router.get('/posts/:id', requireToken, (req, res, next) => {
	// ?req.params.id will be set by the `:id` from the route
	Post.findById(req.params.id)
		.then(handle404)
		//if `findById` is successful, respond with 200 and `example` in JSON
		.then(post => res.status(200).json({ post: post.toObject() }))
		//if an error occures pass to handler
		.catch(next)
})

// create
// POST /posts
router.post('/posts', requireToken, (req, res, next) => {
	//set owner of new post to the current user
	req.body.post.owner = req.user.id
	
	Post.create(req.body.post)
	//respond to successful Post `create` with status 201 and JSON of the new post
		.then(post => {
			res.status(201).json({ post: post.toObject() })
		})
		//if an error occures pass to error handler
		.catch(next)
})

// update
// PATCH /posts/:id
router.patch('/posts/:id', requireToken, (req, res, next) => {
	//if the client attempts to change the owner property by including a new user
	// delete that key value pair from the req
	delete req.body.post.owner
	Post.findById(req.params.id)
		.then(handle404)
		.then(post => {
			// pass `req` and the mongoose record to the requireOwner function
			//it will throw an error if the current user isn't the owner
			requireOwnership(req, post)
			
			// pass the result of `.update` to the next `.then`
			return post.updateOne(req.body.post)
		})
		//if that succeeded, return 204 and no json
		.then(() => res.sendStatus(204))
		// if an error occures pass to the handler
		.catch(next)
})

// destroy
// DELETE /posts/:id
router.delete('/posts/:id', requireToken, (req, res, next) => {
	Post.findById(req.params.id)
		.then(handle404)
		.then(post => {
			//throw and error if current user is not the owner of the post
			requireOwnership(req, post)
			//delete the post only if the above function didn't throw error
			post.deleteOne()
		})
		// send back 204 and no content if cuccessful
		.then(() => res.sendStatus(204))
		// if error occures pass to handler
		.catch(next)
})

// export the router
module.exports = router