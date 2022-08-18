"use strict";

const { Model, DataTypes } = require("sequelize");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a valid name",
          },
          notEmpty: {
            msg: '"First name can not be empty" Please provide a name',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please provide a valid last name",
          },
          notEmpty: {
            msg: '"Last name can not be empty" Please provide a name',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        //Setting unique constrain
        unique: {
          msg: "The email you entered already exist",
        },
        validate: {
          //Regex to validate email from:  https://stackabuse.com/validate-email-addresses-with-regular-expressions-in-javascript/
          is: new RegExp(
            "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
          ),
          notNull: {
            msg: "Please provide a valid email",
          },
          notEmpty: {
            msg: '"Email" can not be empty, please provide a valid email',
          },
        },
      },
      //Hashing password
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          if (val !== "") {
            const hashedPassword = bcrypt.hashSync(val, 10);
            this.setDataValue("password", hashedPassword);
          }
        },
        validate: {
          notNull: {
            msg: "Please provide a valid password",
          },
          notEmpty: {
            msg: "Please provide a valid password",
          },
        },
      },
    },
    { sequelize }
  );

  //User association
  User.associate = (models) => {
    User.hasMany(models.Course, {
      as: "courseUser",
      foreignKey: {
        fieldName: "userId",
        allowNull: false,
      },
    });
  };

  return User;
};
