import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

function requiredEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const firebaseConfig = {
  apiKey: requiredEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
  authDomain: requiredEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: requiredEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
  appId: requiredEnv("NEXT_PUBLIC_FIREBASE_APP_ID"),
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);

