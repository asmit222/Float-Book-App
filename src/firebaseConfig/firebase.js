import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCNiKhRMkN7G_QslJARamAm1dFK312QpuE",
  authDomain: "float-book.firebaseapp.com",
  projectId: "float-book",
  storageBucket: "float-book.appspot.com",
  messagingSenderId: "660147212969",
  appId: "1:660147212969:web:3beaa0477845c5d6ba8fb8",
  measurementId: "G-WDPKS24HZY",
};

const app = initializeApp(firebaseConfig, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
});
export const db = getFirestore(app);
