const express = require("express");

const app = express();

//Importing models
const { User, Course } = require("./models");

//User authentication middleware
const { authenticateUser } = require("./middleware/authenticateUser");

//Importing async handler
const asyncHandler = require("./controllers/asyncHandler");

const router = express.Router();

//Get all users with authentication
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const user = req.currentUser;
      res.status(200).json({
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Create user
router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location("/");
      res.status(201).json({ message: "User successfully created!" });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Get all courses route
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    try {
      //Show User information and filtering attributes
      const options = {
        include: [
          {
            model: User,
            as: "courseUser",
            attributes: ["id", "firstName", "lastName", "emailAddress"],
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      };
      let courses = await Course.findAll(options);
      res.status(200).json(courses);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Get course associated with user
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    try {
      const options = {
        include: [
          {
            model: User,
            as: "courseUser",
            attributes: ["id", "firstName", "lastName", "emailAddress"],
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      };
      const id = +req.params.id;
      const course = await Course.findByPk(id, options);

      //Rendering message if course does not exist
      if (course) {
        res.status(200).json(course);
      } else {
        res.status(404).json({ message: "Course id does not exist" });
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Create a new course
router.post(
  "/courses",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.location(`/courses/${course.id}`);
      res.status(201).end();
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Updates existing course
router.put(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const id = +req.params.id;
      const course = await Course.findByPk(id);
      //Checking if course existss
      if (course) {
        //Checking authentication
        if (req.currentUser.id === course.userId) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res
            .status(403)
            .json({ message: "You are not allowed to update this course" });
        }
      } else {
        res.status(404).json({ message: "Course does not exist" });
      }
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

//Delete course
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const id = +req.params.id;
      const course = await Course.findByPk(id);

      //Checking if course existss
      if (course) {
        //Checking authentication
        if (req.currentUser.id === course.userId) {
          await course.destroy(req.body);
          res.status(204).end();
        } else {
          res
            .status(403)
            .json({ message: "You are not allowed to delete this course" });
        }
      } else {
        res.status(404).json({ message: "Course does not exist" });
      }
    } catch (error) {
      throw error;
    }
  })
);

module.exports = router;
