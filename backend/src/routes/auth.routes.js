const {Router} = require('express');
const authController = require("../controllers/auth.controller")
const { authUser } = require("../middlewares/auth.middleware");
const { validateRegister, validateLogin } = require("../middlewares/validate.middleware");
const authRouter = Router();


authRouter.post("/register", validateRegister, authController.registerUserController)

authRouter.post("/login", validateLogin, authController.loginUserController)

authRouter.post("/google", authController.googleAuthController)

authRouter.patch("/role", authUser, authController.switchRoleController)

authRouter.post("/logout", authController.logoutUserController)

authRouter.get("/me", authUser, authController.getMeController)

module.exports = authRouter;