// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDaUXvPFdLLUvgBm01JUdHC_3dF8Zqm_xs",
  authDomain: "formulariocurso-8ee76.firebaseapp.com",
  projectId: "formulariocurso-8ee76",
  storageBucket: "formulariocurso-8ee76.firebasestorage.app",
  messagingSenderId: "458496487471",
  appId: "1:458496487471:web:331b633ef8a682de8216da",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
