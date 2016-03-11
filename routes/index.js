'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require("../models/index");
var Tweet = tweetBank.Tweet, User = tweetBank.User;
//var tweetBank = require('../tweetBank');

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    Tweet.findAll({
			include: [User]
		})
		.then(function (tweets) {
			res.render('index', {
				title: 'Twitter.js',
				tweets: tweets,
				showForm: true
			});
		});
  }

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);

  // single-user page
  router.get('/users/:username', function(req, res, next){
		Tweet.findAll({
			include: [{
						model: User,
			      where: {name: req.params.username}
							 }]
		}) 
		.then(function (tweets) {
			console.log(tweets);
			res.render('index', {
				title: 'Twitter.js',
				tweets: tweets,
				showForm: true,
				username: req.params.username
			});
		});
	});

  // single-tweet page
  router.get('/tweets/:id', function(req, res, next){
		Tweet.findAll({
			include: [User],
			where: {id: req.params.id}
		}) 
		.then(function (tweets) {
			console.log(tweets);
			res.render('index', {
				title: 'Twitter.js',
				tweets: tweets,
				showForm: true,
			});
		});
  });

  // create a new tweet
  router.post('/tweets', function(req, res, next){
		var obj = {};
		User
    .findOrCreate({
				where: {
					name: req.body.name,
			  },
				defaults: {
					pictureUrl: "http://lorempixel.com/40/40"
				}
		})
	  .then(function(user) {
			//console.log("user Object", user);
			obj = user[0];
      return Tweet.create({
				content: req.body.text,
				UserId: obj.id
			});
		})
		.then(function (newTweet) {
      //console.log(obj);
      io.sockets.emit('new_tweet', {
			  content: newTweet.content,
				id: newTweet.id,
        User: obj
			});
      res.redirect('/');
		});



 //   var newTweet = tweetBank.add(req.body.name, req.body.text);
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
