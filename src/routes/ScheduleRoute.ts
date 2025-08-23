import { Router } from "express";
import * as ScheduleController from "$controllers/rest/ScheduleController"
import { protect } from "$middlewares/authMiddleware";

const ScheduleRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

ScheduleRoutes.get("/available",
    ScheduleController.getAvailableSchedules
)

ScheduleRoutes.get("/",
    protect,
    ScheduleController.getAllSchedules
)

ScheduleRoutes.get("/:id",
    protect,
    ScheduleController.getScheduleById
)

ScheduleRoutes.post("/",
    protect,
    ScheduleController.createSchedule
)

ScheduleRoutes.put("/:id",
    protect,
    ScheduleController.updateSchedule
)

ScheduleRoutes.delete("/:id",
    protect,
    ScheduleController.deleteSchedule
)

export default ScheduleRoutes