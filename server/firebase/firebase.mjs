import {initializeApp, cert} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';

import fs from 'fs';
const serviceAccount = JSON.parse(fs.readFileSync('./firebase/creds.json', 'utf8'));


initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

export { db };