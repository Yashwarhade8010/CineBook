const {Router} = require("express");
const { handleAddScreen, handleAddMovie, handleAddShow } = require("../controllers/adminController");

const router = Router();

router.post("/addMovie",handleAddMovie)
router.post("/addScreen",handleAddScreen)
router.post("/addShow",handleAddShow)

module.exports = router