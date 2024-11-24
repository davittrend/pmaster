import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
apiKey: "AIzaSyDsm9eLK60DgbIPTIXGWzvBRGbvBPUZsJg",
authDomain: "mighty-pinner.firebaseapp.com",
projectId: "mighty-pinner",
storageBucket: "mighty-pinner.firebasestorage.app",
messagingSenderId: "475747703677",
appId: "1:475747703677:web:7f0f9bf347a75eda1c0a14"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;