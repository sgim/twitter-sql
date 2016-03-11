'use strict';
var express = require('express');
var router = express.Router();
var tweetBank = require("../models/index");
var Tweet = tweetBank.Tweet, User = tweetBank.User;

module.exports = function makeRouterWithSockets (io) {

  // a reusable function
  function respondWithAllTweets (req, res, next){
    Tweet.findAll({
			include: [User]
		})
		.then(function (tweets) {
			res.render(req.session.loggedIn ? 'user': "index", {
				title: 'Twitter.js',
				tweets: tweets,
				user: req.session.user
			});
		})
		.catch(console.error);
  }
  

  // here we basically treet the root view and tweets view as identical
  router.get('/', respondWithAllTweets);
  router.get('/tweets', respondWithAllTweets);
  router.get('/login', function (req, res) {
	  User.findAndCountAll()
		.then(function (users) {
			var userID = Math.random() * users.count + 1 | 0;
      req.session.user = users.rows[userID];
			console.log(req.session.user);
      req.session.loggedIn = !req.session.loggedIn;
      res.redirect('/');

		})
	  .catch(console.error);
	});

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
			res.render(req.session.loggedIn ? 'user': "index", {
				title: 'Twitter.js',
				tweets: tweets,
				user: req.session.user
			});
		})
		.catch(console.error);
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
				tweets: tweets
			});
		})
		.catch(console.error);
  });

  // create a new tweet
	// NOTE FROM ARI: Currently broken. makes a tweet appear
	// on all other user's pages no matter what page they are on
	// e.g. on an individual user's page, this new tweet will
	// appear even if it belongs to a different user
  router.post('/tweets', function(req, res, next){
		/*
		var obj;
		User.findOrCreate({
			where: {
				name: req.body.name,
			},
			defaults: {
				pictureUrl: "http://lorempixel.com/40/40"
			}
		})
	  .spread(function(user) {
			obj = user;
      return Tweet.create({
				content: req.body.text,
				UserId: obj.id
			});
		})
		.then(function (newTweet) {
      io.sockets.emit('new_tweet', {
			  content: newTweet.content,
				id: newTweet.id,
        User: obj
			});
      res.redirect('/');
		});
		*/
    Tweet.create({
			content: req.body.text,
			UserId: req.session.user.id
		})
		.then(function (newTweet) {
      io.sockets.emit('new_tweet', {
			  content: newTweet.content,
				id: newTweet.id,
        User: req.session.user
			});
      res.redirect('/');
		})
		.catch(console.error);
  });

  // // replaced this hard-coded route with general static routing in app.js
  // router.get('/stylesheets/style.css', function(req, res, next){
  //   res.sendFile('/stylesheets/style.css', { root: __dirname + '/../public/' });
  // });

  return router;
}
