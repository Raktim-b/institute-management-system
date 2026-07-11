const userModel = require("../model/userModel");
const httpStatusCode = require("../utils/httpStatusCode");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const roleModel = require("../model/roleModel");
const logger = require("../utils/logger");
const registerValidation = require("../validation/authValidation");
const emailVerificationModel = require("../model/verificationModel");
const sendEmail = require("../utils/sendEmail");

class AuthController {
  async createRole(req, res) {
    try {
      const { role } = req.body;
      logger.debug("Create role request received: %s", role);
      const existingRole = await roleModel.findOne({ role });

      if (existingRole) {
        logger.warn("Role already exists: %s", role);
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Role already exists",
        });
      }

      const data = new roleModel({
        role,
      });

      const result = await data.save();
      logger.info("Role created successfully: %s", role);
      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Role created successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error creating role: %s", error.stack);
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async createAdmin(req, res) {
    try {
      const userRole = await roleModel.findOne({
        role: "admin",
      });
      if (!userRole) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Role role not found",
        });
      }

      const existingAdmin = await userModel.findOne({
        email: process.env.ADMIN_EMAIL,
      });
      if (existingAdmin) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Admin already exist",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
      const userData = await userModel.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: hashPassword,
        roleId: userRole._id,
        isVerified: true,
      });

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "User Added successfully",
        data: userData,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async registerStudent(req, res) {
    try {
      const { error } = registerValidation.validate(req.body);

      if (error) {
        logger.warn("Validation failed: %s", error.details[0].message);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const { name, email, password } = req.body;

      logger.debug("User registration request received for email: %s", email);

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        logger.warn(
          "User registration failed: Email already exists (%s)",
          email,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      const userRole = await roleModel.findOne({
        role: "student",
      });

      if (!userRole) {
        logger.error("User registration failed: 'user' role not found");

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User role not found",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const userData = new userModel({
        name,
        email,
        password: hashPassword,
        roleId: userRole._id,
      });

      const result = await userData.save();
      await sendEmail(result);
      logger.info("User registered successfully: %s", email);

      logger.info("Verification email sent to: %s", email);

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "User Added successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while registering user: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async registerTeacher(req, res) {
    try {
      const { error } = registerValidation.validate(req.body);

      if (error) {
        logger.warn("Validation failed: %s", error.details[0].message);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: error.details[0].message,
        });
      }
      const { name, email, password } = req.body;

      logger.debug(
        "Teacher registration request received for email: %s",
        email,
      );

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        logger.warn(
          "Teacher registration failed: Email already exists (%s)",
          email,
        );

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Teacher already exists",
        });
      }

      const userRole = await roleModel.findOne({
        role: "teacher",
      });

      if (!userRole) {
        logger.error("User registration failed: 'teacher' role not found");

        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "Teacher role not found",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const userData = new userModel({
        name,
        email,
        password: hashPassword,
        roleId: userRole._id,
      });

      const result = await userData.save();
      await sendEmail(result);
      logger.info("Teacher registered successfully: %s", email);

      logger.info("Verification email sent to: %s", email);

      return res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Teacher Added successfully",
        data: result,
      });
    } catch (error) {
      logger.error("Error while registering teacher: %s", error.stack);

      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const checkUser = await userModel.aggregate([
        {
          $match: {
            email: email,
          },
        },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $unwind: "$role",
        },
      ]);
      if (checkUser.length === 0) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "invalid credential",
        });
      }
      const user = checkUser[0];
      const checkPassowrd = await bcrypt.compare(password, user.password);
      if (!checkPassowrd) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "wrong password",
        });
      }
      if (!user.isVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not varified",
        });
      }

      const accessToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "10s" },
      );
      const refreshToken = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role.role,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );
      await userModel.findByIdAndUpdate(user._id, {
        refreshToken,
      });
      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "User Logedin Successfully",
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role.role,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async refreshToken(req, res) {
    try {
      const refreshToken = req.headers["refresh-token"];
      if (!refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Refresh token missing",
        });
      }
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userModel.findById(decoded.id);
      if (!user) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "User not found",
        });
      }
      if (user.refreshToken !== refreshToken) {
        return res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Invalid refresh token",
        });
      }
      const newAccessToken = jwt.sign(
        {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "5m",
        },
      );
      return res.status(httpStatusCode.OK).json({
        success: true,
        data: {
          name: user.name,
          email: user.email,
          newAccessToken: newAccessToken,
        },
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
  async verify(req, res) {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid verification link",
        });
      }

      const emailVerification = await emailVerificationModel.findOne({
        token,
      });

      if (!emailVerification) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid verification link",
        });
      }

      const existingUser = await userModel.findById(emailVerification.userId);

      if (!existingUser) {
        return res.status(httpStatusCode.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }

      if (existingUser.isVerified) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "Email already verified",
        });
      }

      const currentTime = new Date();

      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 15 * 60 * 1000,
      );

      if (currentTime > expirationTime) {
        await sendEmail(existingUser);

        return res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message:
            "Verification link expired. A new verification email has been sent.",
        });
      }

      existingUser.isVerified = true;

      await existingUser.save();

      await emailVerificationModel.deleteMany({
        userId: existingUser._id,
      });

      return res.status(httpStatusCode.OK).json({
        success: true,
        message: "Email verified successfully",
      });
    } catch (error) {
      return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}
module.exports = new AuthController();
