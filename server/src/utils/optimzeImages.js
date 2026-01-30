import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";

export const optimizeImage = async (imagePublicId) => {
  return cloudinary.url(imagePublicId, {
    quality: "80",
    fetch_format: "auto",
  });
};

// Compress all existing product images in the database
// export const compressAllImages = async () => {
//   try {
//     const products = await Product.find({}).select("_id image");

//     for (let { _id, image } of products) {
//       const optimziedImagesArray = [];
//       for (let imageUrl of image) {
//         const publicId = imageUrl.split("%")[0].split("/").slice(-1)[0];;
//         const optimizedImageUrl = await optimizeImage(publicId);
//         optimziedImagesArray.push(optimizedImageUrl);
//       }
//       await Product.findByIdAndUpdate(_id, { image: optimziedImagesArray });
//     }

//   } catch (error) {
//     console.log("Error compressing images: ", error);
//   }
// };
