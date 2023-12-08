"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Products extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			this.belongsTo(models.Users, { as: "user" });
		}
	}
	Products.init(
		{
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: DataTypes.INTEGER,
			},
			userId: {
				allowNull: false,
				type: DataTypes.INTEGER,
			},
			productName: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			content: {
				allowNull: false,
				type: DataTypes.STRING,
			},
			status: {
				allowNull: false,
				type: DataTypes.STRING,
				defaultValue: "FOR_SALE",
			},
			createdAt: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
			updatedAt: {
				allowNull: false,
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
			},
		},
		{
			sequelize,
			modelName: "Products",
		},
	);
	return Products;
};
