import { response_not_found, response_success } from "$utils/response.utils";
import { Request, Response, Router } from "express";
import RoutesRegistry from "./registry";
// import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.get("/", (req: Request, res: Response) => {
    return response_success(res, "main routes!");
})

router.get('/robots.txt', function (req:Request, res:Response) {
    res.type('text/plain')
    res.send(
    `User-agent: *\nAllow: /`);
});
router.get("/ping", (req: Request, res: Response) => {
    return response_success(res, "pong!");
});

router.use("/auth", RoutesRegistry.AuthRoutes)

router.all("*", (req: Request, res: Response) => {
    return response_not_found(res);
});

export default router;