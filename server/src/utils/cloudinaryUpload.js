import streamifier
from "streamifier";

import cloudinary
from "../config/cloudinary.js";

export const uploadToCloudinary =
  (fileBuffer, folder) => {

    return new Promise(
      (resolve, reject) => {

        const stream =
          cloudinary.uploader.upload_stream(

            {
              folder,

              resource_type:
                "image",
            },

            (error, result) => {

              if (result) {

                resolve(result);

              } else {

                reject(error);
              }
            }
          );

        streamifier
          .createReadStream(
            fileBuffer
          )
          .pipe(stream);
      }
    );
  };