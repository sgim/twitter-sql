var Sequelize = require("sequelize");

var twitterjsDB = new Sequelize("twitterjs", "root", null, {
  dialect: "sqlite",
	storage: "../databases/twitterjs.db",
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


