"use strict";

const auth = require("basic-auth");
const { User } = require("../models");
const bcrypt = require("bcrypt");

//Middlewate to authenticate user

exports.authenticateUser = async (req, res, next) => {
  //Message to display to user
  let message;

  const credentials = auth(req);

  //Getting user credentials if they are available
  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name },
    });

    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);

      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );

        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header no found";
  }

  //Sending response to user if there has been an issue
  if (message) {
    console.log(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
