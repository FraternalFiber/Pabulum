import multer from "multer";
import { ACCEPTED_IMAGE_TYPES, MAX_RECIPE_IMAGE_SIZE } from "../constants.mjs";

export function uploadFile() {
  const upload = multer({
    limits: {
      fileSize: MAX_RECIPE_IMAGE_SIZE,
    },
    fileFilter: (req, file, cb) => {
      // Filter image file extension
      if (ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb({ message: "Unsupported file type" }, false);
      }
    },
  }).single("image");

  return (req, res, next) => {
    upload(req, res, function (error) {
      if (error) {
        res.status(400).json({ success: false, message: error.message });
      } else {
        // If user didn't attach an image, multer will leave image property undefined,
        // so it has to be deleted.
        if (req.body.image) {
          delete req.body.image;
        }

        try {
          // Parse every property (except image) back to JSON format
          for (const key in req.body) {
            req.body[key] = JSON.parse(req.body[key]);
          }
        } catch (error) {
          res.status(400).json({ success: false, message: "Invalid JSON format" });
        }

        next();
      }
    });
  };
}
