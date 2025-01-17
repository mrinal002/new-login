import { Router } from "express";
import { loginUser, registerUser, logoutUser, refreshaAccesstoken, changePassword, getCurrentUser } from "../controllers/user.controllers.js";

import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
          name: "avatar",
          maxCount: 1, 
        },
        {
            name: "coverImage",
            maxCount: 1, 
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)
//router.route("/logout").post(verifyJWT, logoutUser); 
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresha-access-token").post(refreshaAccesstoken)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/current-user").get(getCurrentUser)

export default router