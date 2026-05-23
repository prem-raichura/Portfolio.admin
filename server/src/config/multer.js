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