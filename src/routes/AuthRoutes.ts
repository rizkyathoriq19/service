import { Router } from "express";
import * as AuthController from "$controllers/rest/AuthController"

const AuthRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

AuthRoutes.post("/login",
    AuthController.login
)

AuthRoutes.post("/register",
    AuthController.register
)

export default AuthRoutes