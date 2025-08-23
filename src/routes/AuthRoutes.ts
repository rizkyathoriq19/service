import { Router } from "express";
import * as AuthController from "$controllers/rest/AuthController"
import { protect } from "$middlewares/authMiddleware";

const AuthRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

AuthRoutes.post("/login",
    AuthController.login
)

AuthRoutes.post("/register",
    AuthController.register
)

AuthRoutes.get("/profile",
    protect,
    AuthController.getProfile
)

export default AuthRoutes