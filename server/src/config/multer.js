import multer from "multer";

const storage =
  multer.memoryStorage();

const fileFilter =
  (req, file, cb) => {

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only images are allowed"
        ),
        false
      );
    }
  };

export const upload =
  multer({
    storage,

    fileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  });

// Profile updates carry an avatar (image) and optionally a resume (PDF), so the
// filter is per-field: the "resume" field must be a PDF, everything else must be
// an image.
const profileFileFilter =
  (req, file, cb) => {

    const imageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];

    if (file.fieldname === "resume") {

      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Resume must be a PDF"), false);
      }

    } else if (imageTypes.includes(file.mimetype)) {

      cb(null, true);

    } else {

      cb(new Error("Only images are allowed"), false);
    }
  };

export const uploadProfileAssets =
  multer({
    storage,

    fileFilter: profileFileFilter,

    limits: {
      fileSize:
        10 * 1024 * 1024,
    },
  });