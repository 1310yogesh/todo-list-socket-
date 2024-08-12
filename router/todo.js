const { getTodoList, uploadCompressedImage } = require("../controller/todo");
const router = require('express').Router();
const { use } = require("../utils/functionWrapper");
const { uploadImage } = require("../middleware/uploadImg");

router.get("/list", use(getTodoList));
router.post("/upload-image", use(uploadImage), use(uploadCompressedImage));

module.exports = router;
