import "server-only";

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const serviceAccountPath = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH;
const serviceAccountJson = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON;

if (!serviceAccountJson && !serviceAccountPath) {
  throw new Error(
    "FIREBASE_ADMIN_SERVICE_ACCOUNT_JSON veya FIREBASE_ADMIN_SERVICE_ACCOUNT_PATH ortam değişkenlerinden biri tanımlı olmalı.",
  );
}

const serviceAccount = serviceAccountJson
  ? JSON.parse(serviceAccountJson)
  : JSON.parse(
      readFileSync(
        resolve(/* turbopackIgnore: true */ process.cwd(), serviceAccountPath as string),
        "utf8",
      ),
    );

export const firebaseAdminApp =
  getApps()[0] ??
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });

export const adminAuth = getAuth(firebaseAdminApp);
export const adminDb = getFirestore(firebaseAdminApp);
export const adminStorage = getStorage(firebaseAdminApp);
