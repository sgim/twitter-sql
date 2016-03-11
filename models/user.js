var Sequelize = require("sequelize");

module.exports = function (db) {
	 return db.define("User", {
		name: Sequelize.STRING,
    pictureUrl: Sequelize.STRING
	}, {
		timestamps: false
	});
};
