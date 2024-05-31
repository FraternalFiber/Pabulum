import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";

const serviceAccount = JSON.parse(fs.readFileSync("./firebase/creds.json", "utf8"));

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://pabulum-zsk-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "gs://pabulum-zsk.appspot.com",
});

const db = getFirestore();
export { db };
const bucket = getStorage().bucket();
export { bucket };