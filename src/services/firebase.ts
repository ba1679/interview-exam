import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { TloginForm, TsignUpForm } from 'types';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const signUpAndUpdateUserInfo = async (data: TsignUpForm) => {
  const { email, password, firstName, lastName, photoURL } = data;
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, {
    displayName: `${lastName} ${firstName}`,
    photoURL,
  });
  return user;
};

export const login = async (data: TloginForm) => {
  const { email, password } = data;
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
};

export const signOutFromFirebase = async () => {
  const res = await signOut(auth);
  return res;
};

const provider = new GoogleAuthProvider();
export const signInWighGoogle = async () => {
  const { user } = await signInWithPopup(auth, provider);
  return user;
};

export const storage = getStorage(app);
