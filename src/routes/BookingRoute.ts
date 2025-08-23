import { Router } from "express";
import * as BookingController from "$controllers/rest/BookingController"
import { protect } from '../middlewares/authMiddleware';

const BookingRoutes = Router({mergeParams:true}) // mergeParams = true -> to enable parsing query params

BookingRoutes.post("/",
    BookingController.createBooking
)

BookingRoutes.get("/",
    protect,
    BookingController.getAllBookings
)

BookingRoutes.get("/:id",
    protect,
    BookingController.getBookingById
)

BookingRoutes.put("/:id/status",
    protect,
    BookingController.updateBookingStatus
)

BookingRoutes.delete("/:id",
    protect,
    BookingController.deleteBooking
)

export default BookingRoutes