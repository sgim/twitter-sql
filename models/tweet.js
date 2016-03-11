var Sequelize = require("sequelize");
module.exports = function (db) {
	return db.define("Tweet", {
		content: Sequelize.STRING
	}, {
		timestamps: false
	});
};
