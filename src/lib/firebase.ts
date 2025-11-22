import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

import { firebaseConfig } from "@/config/firebase.config";

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export { serverTimestamp };
