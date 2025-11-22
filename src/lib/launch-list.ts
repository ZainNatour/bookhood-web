import { addDoc, collection } from "firebase/firestore";

import { db, serverTimestamp } from "@/lib/firebase";

const launchListCollectionPath = "launch-list" as const;

export async function subscribeToLaunchList(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Email address is required");
  }

  await addDoc(collection(db, launchListCollectionPath), {
    email: normalizedEmail,
    createdAt: serverTimestamp(),
  });
}
