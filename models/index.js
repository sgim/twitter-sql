var Sequelize = require("sequelize");
var twitterjsDB = new Sequelize("twitterjs", "root", null, {
  dialect: "sqlite",
	// path shouldn't be hard coded - should use an environment path
	//storage: process.env.DB_PATH
	storage: "../databases/twitterjs.db",
	logging: false
});

twitterjsDB
.authenticate()
.then(function() {
  console.log("Connection has been established successfully");
})
.catch(function (err) {
	console.error("Problem connecting to the database:", err);
});

var Tweet = require("./tweet")(twitterjsDB);
var User = require("./user")(twitterjsDB);
User.hasMany(Tweet);
Tweet.belongsTo(User);

module.exports = {
	User: User,
	Tweet: Tweet
};


