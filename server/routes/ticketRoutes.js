const {Router} = require("express");
const {
  handleTicketBooking,
  handleTicketCancel,
  handleFetchBookings,
} = require("../controllers/ticketController");

const router = Router();

router.post("/book",handleTicketBooking)
router.post("/cancel",handleTicketCancel)
router.get("/bookings", handleFetchBookings);

module.exports = router