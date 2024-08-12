const createError = require("http-errors");
const multer = require("multer");
const sharp = require("sharp");
const path = require('path');
const fs = require('fs');
const util = require('util');

// read, compress/resize, store image file in image path
const uploadImage = async (req, res, next) => {
    const storage = multer.memoryStorage();
    const writeFile = util.promisify(fs.writeFile);
    multer({ storage }).single('image')(req, res, async (err) => {
        if (err) {
            return res.status(400).send('Error uploading file.');
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        try {
            const compressedImageBuffer = await sharp(req.file.buffer)
                .resize(800, 800)
                .jpeg({ quality: 80 }) 
                .toBuffer();

            const uploadPath = path.join(__dirname,"..", 'images', req.file.originalname);
            await writeFile(uploadPath, compressedImageBuffer);

            req.compressedImage = compressedImageBuffer;
            req.file.filename = req.file.originalname; 
            req.file.mimetype = req.file.mimetype;
            next();
        } catch (error) {
            return next(createError(500, error));
        }
    });
};

module.exports = { uploadImage }