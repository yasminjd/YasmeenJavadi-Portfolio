// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
// Import additional services as needed:
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJIlnCgl8qf5fpmE_mw4enxNkPySygPOA",
  authDomain: "portfolio-30271.firebaseapp.com",
  projectId: "portfolio-30271",
  storageBucket: "portfolio-30271.firebasestorage.app",
  messagingSenderId: "873307364004",
  appId: "1:873307364004:web:98232fdcdd6ab310ef6431",
  measurementId: "G-M15E5FYMXJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

// Export for use in other files
// export const db = getFirestore(app);      // Uncomment when you need Firestore
// export const auth = getAuth(app);         // Uncomment when you need Auth

export { app, analytics, storage, ref, getDownloadURL };
