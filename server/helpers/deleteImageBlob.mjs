// import { bucket } from "../firebase/firebase.mjs";
// import path from "path";
//
// export async function deleteImageBlob(filePath) {
//   // Parse the URL and extract the pathname
//   const imageUrl = new URL(filePath);
//   let imagePath = imageUrl.pathname;
//
//   // Remove the leading '/' from the pathname and get the file path
//   imagePath = path.join(imagePath.slice(1));
//
//   // Remove the bucket name from the file path
//   const bucketName = 'pabulum-zsk.appspot.com/';
//   const blobFilePath = imagePath.slice(bucketName.length);
//
//   const oldBlob = bucket.file(blobFilePath);
//   const [exists] = await oldBlob.exists();
//
//   if(exists) {
//     await oldBlob.delete();
//   }
//   else {
//     console.log(`No file exists at path: ${blobFilePath}`);
//   }
// }