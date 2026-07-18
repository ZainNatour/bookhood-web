import { z } from "zod";

const firebaseConfigSchema = z.object({
  apiKey: z.string().min(1, "NEXT_PUBLIC_FIREBASE_API_KEY is required"),
  authDomain: z.string().min(1, "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required"),
  projectId: z.string().min(1, "NEXT_PUBLIC_FIREBASE_PROJECT_ID is required"),
  storageBucket: z.string().min(1, "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required"),
  messagingSenderId: z
    .string()
    .min(1, "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required"),
  appId: z.string().min(1, "NEXT_PUBLIC_FIREBASE_APP_ID is required"),
  measurementId: z.string().optional(),
});

type FirebaseConfig = z.infer<typeof firebaseConfigSchema>;

const fallbackFirebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDBGE2Selz7w7GMzPmCJ9c8hAtwwEb5XiWU",
  authDomain: "bookhood-d2836.firebaseapp.com",
  projectId: "bookhood-d2836",
  storageBucket: "bookhood-d2836.appspot.com",
  messagingSenderId: "384711663163",
  appId: "1:384711663163:web:dd7996653629d13751061e",
  measurementId: "G-M9TY33C73N",
};

const releaseTarget = process.env.BOOKHOOD_WEB_RELEASE_TARGET ?? "local";
const allowFallbackConfig = releaseTarget !== "public";

const readEnvVar = (key: string) => {
  const value = process.env[key];

  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return undefined;
};

const readFirebaseEnvVar = (key: string, fallback: string | undefined) => {
  const value = readEnvVar(key);
  if (value) {
    return value;
  }
  if (allowFallbackConfig) {
    return fallback;
  }
  return undefined;
};

const firebaseConfig = firebaseConfigSchema.parse({
  apiKey: readFirebaseEnvVar("NEXT_PUBLIC_FIREBASE_API_KEY", fallbackFirebaseConfig.apiKey),
  authDomain:
    readFirebaseEnvVar("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", fallbackFirebaseConfig.authDomain),
  projectId:
    readFirebaseEnvVar("NEXT_PUBLIC_FIREBASE_PROJECT_ID", fallbackFirebaseConfig.projectId),
  storageBucket:
    readFirebaseEnvVar("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", fallbackFirebaseConfig.storageBucket),
  messagingSenderId:
    readFirebaseEnvVar(
      "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
      fallbackFirebaseConfig.messagingSenderId,
    ),
  appId: readFirebaseEnvVar("NEXT_PUBLIC_FIREBASE_APP_ID", fallbackFirebaseConfig.appId),
  measurementId:
    readEnvVar("NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID") ??
    fallbackFirebaseConfig.measurementId,
});

export { firebaseConfig };
