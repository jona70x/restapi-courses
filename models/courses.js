const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Course extends Model {}

  Course.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Title" can not be empty. Please provide a valid course title',
          },
          notNull: {
            msg: "Please provide a valid title",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: '"Description can not be empty". Please provide a course description',
          },
          notNull: {
            msg: "Please provide a valid description",
          },
        },
      },
      estimatedTime: DataTypes.STRING,
      materialsNeeded: DataTypes.STRING,
    },
    { sequelize }
  );

  //Associations
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      as: "courseUser",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return Course;
};
