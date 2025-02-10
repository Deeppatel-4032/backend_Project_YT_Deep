import { Router } from "express";
import { registerUserCon,
         loginUserCon,
         userLogoutCon,
         refreshAccessToken
        } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJwt } from "../middlewares/auth.middleware.js" 
const router = Router();

router.post("/register", upload.fields([
    {name : "avatar", maxCount : 1},
    {name : "coverImage", maxCount : 1}    
 ]),
 registerUserCon );

 // login
router.post("/login", loginUserCon);

//secured routes
router.post("/logout", verifyJwt, userLogoutCon);

//refresh Token 
router.post("/refresh-token", refreshAccessToken)

export default router;