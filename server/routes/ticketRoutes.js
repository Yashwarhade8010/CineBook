const {Router} = require("express");
const { handleTicketBooking, handleTicketCancel } = require("../controllers/ticketController");

const router = Router();

router.post("/book",handleTicketBooking)
router.post("/cancel",handleTicketCancel)

module.exports = router